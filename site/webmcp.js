(() => {
	"use strict";

	const EXTENSION_VERSION = "webmcp-challenge-0.1.0";
	const controller = window.DreamRealmChallenge;
	const registeredTools = [];

	function noArgumentsSchema() {
		return {
			type: "object",
			properties: {},
			additionalProperties: false
		};
	}

	function success(action, state, summary) {
		return {
			ok: true,
			action,
			summary,
			state
		};
	}

	function rejectToolAction(error) {
		const code = error?.code || "ACTION_REJECTED";
		const message = error?.message || "Dream Realm rejected the requested action.";
		throw new Error(`[${code}] ${message}`);
	}

	function mutation(action, run, summary) {
		try {
			const state = run();
			if (state instanceof Promise) {
				return state
					.then(nextState => success(action, nextState, summary(nextState)))
					.catch(rejectToolAction);
			}
			return success(action, state, summary(state));
		} catch (error) {
			return rejectToolAction(error);
		}
	}

	const toolDefinitions = [
		{
			name: "get_dream_realm_state",
			description: "Read the current live Dream Realm screen, route, mission progress, creator choices, unlocks, video readiness, and valid next actions. This tool never changes game state.",
			inputSchema: noArgumentsSchema(),
			annotations: { readOnlyHint: true },
			execute: async () => ({
				ok: true,
				extensionVersion: EXTENSION_VERSION,
				state: controller.getState()
			})
		},
		{
			name: "start_dream_realm_route",
			description: "Start either the Dance Gateway Mission or Direct Creator route from the ready HUB. This visibly changes the current page. It cannot skip the human-controlled portal entrance.",
			inputSchema: {
				type: "object",
				properties: {
					route: {
						type: "string",
						enum: ["gateway", "creator"],
						description: "gateway starts Signal Sync; creator opens Direct Creator Tools."
					}
				},
				required: ["route"],
				additionalProperties: false
			},
			annotations: { readOnlyHint: false },
			execute: async ({ route }) => mutation(
				"start_dream_realm_route",
				() => controller.startRoute(route),
				state => `Started the ${route} route. The visible screen is now ${state.screen}.`
			)
		},
		{
			name: "submit_dance_signal",
			description: "Submit one numbered cue to the live Dance Signal Sync mission when it is accepting input. This visibly updates the signal feedback, score, and mission progress.",
			inputSchema: {
				type: "object",
				properties: {
					signal: {
						type: "integer",
						minimum: 1,
						maximum: 4,
						description: "The visible Dance signal number, from 1 through 4."
					}
				},
				required: ["signal"],
				additionalProperties: false
			},
			annotations: { readOnlyHint: false },
			execute: async ({ signal }) => mutation(
				"submit_dance_signal",
				() => controller.submitDanceSignal(signal),
				state => `Submitted signal ${signal}. Mission score is ${state.mission.score}; input ${state.mission.inputIndex} of ${state.mission.cueCount}.`
			)
		},
		{
			name: "resolve_murk_doubt",
			description: "Resolve Murk's live doubt moment by trusting the restored evidence or following doubt. This advances the visible experience to Creator Tools and may affect the result category.",
			inputSchema: {
				type: "object",
				properties: {
					choice: {
						type: "string",
						enum: ["evidence", "doubt"],
						description: "evidence trusts the repaired signal; doubt accepts Murk's alternate interpretation."
					}
				},
				required: ["choice"],
				additionalProperties: false
			},
			annotations: { readOnlyHint: false },
			execute: async ({ choice }) => mutation(
				"resolve_murk_doubt",
				() => controller.resolveMurkDoubt(choice),
				state => `Resolved Murk with '${choice}'. The visible screen is now ${state.screen}.`
			)
		},
		{
			name: "set_creator_choices",
			description: "Set all live Creator Tool selections atomically: Naya outfit, background, movement, and an available outcome effect. The visible preview updates immediately. Locked effects are rejected.",
			inputSchema: {
				type: "object",
				properties: {
					outfit: { type: "string", enum: ["neon", "glamour", "street"] },
					background: { type: "string", enum: ["neon", "glamour", "street"] },
					movement: { type: "string", enum: ["pulse_step", "arc_turn", "power_finish"] },
					effect: { type: "string", enum: ["creator", "restored"] }
				},
				required: ["outfit", "background", "movement", "effect"],
				additionalProperties: false
			},
			annotations: { readOnlyHint: false },
			execute: async input => mutation(
				"set_creator_choices",
				() => controller.setCreatorChoices(input),
				state => `Updated the visible preview to ${state.creator.outfit}, ${state.creator.background}, ${state.creator.movement}, ${state.creator.effect}.`
			)
		},
		{
			name: "prepare_performance",
			description: "Build and play the live Naya performance from the currently selected outfit, background, movement, effect, and mission result. This may load 145 image frames and visibly opens Performance Preview. It does not record or download video.",
			inputSchema: noArgumentsSchema(),
			annotations: { readOnlyHint: false },
			execute: async () => mutation(
				"prepare_performance",
				() => controller.preparePerformance(),
				state => `Prepared ${state.creator.outcomeKey}; the visible Performance Preview is ready. Use the human-controlled Generate video export button to record it.`
			)
		},
		{
			name: "send_output_to_tower",
			description: "Send the prepared creator output to Trending Tower only after the human has generated the video with the visible recording control. This visibly opens Tower, records its response, and may grant the Gateway unlock.",
			inputSchema: noArgumentsSchema(),
			annotations: { readOnlyHint: false },
			execute: async () => mutation(
				"send_output_to_tower",
				() => controller.sendOutputToTower(),
				state => `Sent ${state.creator.outcomeKey} to Trending Tower. Tower active: ${state.hub.towerActive}.`
			)
		},
		{
			name: "return_to_hub",
			description: "Return from the live Trending Tower result to the Dream Realm HUB. This visibly restores the HUB with its updated Tower state.",
			inputSchema: noArgumentsSchema(),
			annotations: { readOnlyHint: false },
			execute: async () => mutation(
				"return_to_hub",
				() => controller.returnToHub(),
				state => `Returned to ${state.screen}. Tower active: ${state.hub.towerActive}.`
			)
		}
	];

	window.DreamRealmWebMCP = {
		version: EXTENSION_VERSION,
		supported: false,
		registeredTools,
		toolNames: toolDefinitions.map(tool => tool.name)
	};

	async function registerTools() {
		if (!controller) {
			console.warn("DreamRealmChallenge controller is unavailable; WebMCP tools were not registered.");
			return;
		}
		if (typeof document.modelContext?.registerTool !== "function") {
			return;
		}

		for (const definition of toolDefinitions) {
			await document.modelContext.registerTool(definition);
			registeredTools.push(definition.name);
		}
		window.DreamRealmWebMCP.supported = true;
		window.dispatchEvent(new CustomEvent("dreamrealm:webmcp-ready", {
			detail: { version: EXTENSION_VERSION, tools: [...registeredTools] }
		}));
	}

	registerTools().catch(error => {
		console.error("Dream Realm WebMCP registration failed", error);
	});
})();
