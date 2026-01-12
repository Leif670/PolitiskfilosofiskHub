// app/domain/types.ts

export type VoteOptionId = "yes" | "no" | "undecided";

export interface VoteOption {
  id: VoteOptionId;
  label: string;
}

export interface Poll {
  id: string;
  title: string;
  description?: string; 
  context: string; 
 
  startsAt: string;
  endsAt: string | null;
  options: VoteOption[];
}

export interface PollResult {
  pollId: string;
  counts: Record<VoteOptionId, number>;
}

export interface Argument {
  id: string;
  pollId: string;
  side: "for" | "against";
  text: string;
  createdAt: string;
}
