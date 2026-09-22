// Mirrors the response shape of POST /score on the backend
// (rezulens-backend/api/scoring_pipeline.py).

export type MatchedKeyword = {
  skill: string;
  resume_section: string;
};

export type KeywordOverlapResult = {
  score: number;
  matched: MatchedKeyword[];
  missing: string[];
};

export type Check = {
  name: string;
  passed: boolean;
  detail: string;
};

export type CompletenessResult = {
  score: number;
  checks: Check[];
};

export type FormattingResult = {
  score: number;
  checks: Check[];
};

export type ScoreResponse = {
  overall_score: number;
  keyword_overlap: KeywordOverlapResult;
  completeness: CompletenessResult;
  formatting: FormattingResult;
};
