import { APIInteractionResponse } from "discord-api-types/v10";

export class InteractionPromise extends Promise<APIInteractionResponse> {}
