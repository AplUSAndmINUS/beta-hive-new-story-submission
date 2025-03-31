import { betaHIVESchema } from './betaHIVE-selection.types';
import { promptsSchema } from './prompt-selection.types';
import { contentWarningsSchema } from './content-warnings.types';

export interface authorSchema {
  id: string;
  name: string;
  email: string;
  HIVE: betaHIVESchema['name'];
  wins: storySchema['system']['wins'];
  losses: storySchema['system']['losses'];
  stories: storySchema['title'][];
}

export interface feedbackSchema {
  id: string;
  title: string;
  story: string;
  feedbackAuthor: string;
  feedback: string;
  isPositive: boolean;
  isPublic: boolean;
  isAnonymous: boolean;
}

export interface storySchema {
  id: string;
  // User-editable fields
  title: string;
  author: string;
  story: string;
  isContentSensitive?: boolean;
  isShared: boolean;

  // System-controlled fields (protected from user modification)
  system: {
    HIVE: betaHIVESchema['name'];
    prompts: promptsSchema['name'][];
    contentWarnings: contentWarningsSchema['name'][] | ['None'];
    battleName: string;
    wordCount: number;
    characterCount: number;
    status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
    feedback: Pick<
      feedbackSchema,
      'id' | 'feedback' | 'isPublic' | 'isPositive' | 'isAnonymous'
    >[];
    wins: number;
    losses: number;
    lastModified: string;
    modifiedBy: 'system' | 'admin';
    version: number;
    tags: string[];
    metadata: {
      isUserEditable: boolean;
      lastAdminUpdate: string | null;
      adminId: string | null;
    };
  };
}

// Type for creating a new story (omits fields handled by backend)
export type CreateStorySchema = Omit<storySchema, 'id'> & {
  system: {
    HIVE: betaHIVESchema['name'];
    prompts: promptsSchema['name'][];
    contentWarnings: contentWarningsSchema['name'][] | ['None'];
    battleName: string;
    wordCount: number;
    characterCount: number;
    status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
    feedback: Pick<
      feedbackSchema,
      'id' | 'feedback' | 'isPublic' | 'isPositive' | 'isAnonymous'
    >[];
    wins: number;
    losses: number;
    lastModified: string;
    modifiedBy: 'system' | 'admin';
    version: number;
    tags: string[];
    metadata: {
      isUserEditable: boolean;
      lastAdminUpdate: string | null;
      adminId: string | null;
    };
  };
};
