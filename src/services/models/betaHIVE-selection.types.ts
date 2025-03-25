import { contentWarningsSchema } from "./content-warnings.types";
import { promptsSchema } from "./prompt-selection.types";
import { calendarSchema } from "./calendar.types";

export interface betaHIVESchema {
  id: string;
  name: string;
  imgSource: string;
  description: string;
}

export interface gameSettingsSchema {
  contentWarnings: contentWarningsSchema[];
  prompts: promptsSchema[];
  hives: betaHIVESchema[];
  calendarEvents: calendarSchema[];
  countDownDate: string;
  minWordCount: number;
  maxWordCount: number;
  minPromptSelections: number;
  numOfLosses: number;
  contentWarningsCount: number;
  battleName: string;
  betaHIVECount: number;
  calendarEventCount: number;
  promptCount: number;
}