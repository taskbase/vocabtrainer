import { ClozeBit, EssayBit, MultipleChoiceText } from './bitmark.model';

export interface RecommendTaskRequest {
  topic: string;
  user_id: string;
}

export interface RecommendTaskResponse {
  bitmark: {
    essay: EssayBit;
    cloze: ClozeBit;
    multipleChoiceText: MultipleChoiceText;
  };
}
