import { UserState } from "models/contract";

export type SocketRecord = Map<string, {id: string, status: UserState}>;