import { RecommendTaskResponse } from './recommend.model';

export const RECOMMEND_TASK_RESPONSE: RecommendTaskResponse = {
  bitmark: {
    essay: {
      format: 'text',
      meta: { language: 'de', learningLanguage: 'en', subject: 'oil' },
      feedbackEngine: {
        feedbackId: 'fb182030db4e218d5708642beb33cf25-essay',
        userId: '',
        timeOnTask: 0,
      },
      instruction: 'Übersetzen Sie den Satz: "Dieses Land ist reich an Öl."',
      type: 'essay',
      sampleSolution: 'This country is rich in oil.',
      answer: { text: '' },
      resource: {
        type: 'audio',
        audio: {
          format: 'mp3',
          src: 'http://taskpool.taskbase.com/audio/EN-59246.mp3',
        },
      },
    } as any,
    cloze: {
      format: 'text',
      meta: { language: 'de', learningLanguage: 'en', subject: 'oil' },
      feedbackEngine: {
        feedbackId: 'fb182030db4e218d5708642beb33cf25-cloze',
        userId: '',
        timeOnTask: 0,
      },
      instruction:
        'Gegeben: "Dieses Land ist reich an Öl.", schreiben Sie das fehlende Wort',
      type: 'cloze',
      body: [
        { type: 'text', text: 'This country is rich in ' },
        { type: 'gap', solutions: ['oil'], answer: { text: '' } },
        { type: 'text', text: '.' },
      ] as any,
    } as any,
    multipleChoiceText: {
      format: 'text',
      meta: { language: 'de', learningLanguage: 'en', subject: 'oil' },
      feedbackEngine: {
        feedbackId: 'fb182030db4e218d5708642beb33cf25-multiple-choice-text',
        userId: '',
        timeOnTask: 0,
      },
      instruction:
        'Gegeben: "Dieses Land ist reich an Öl.", wählen Sie das fehlende Wort aus',
      type: 'multiple-choice-text' as any,
      body: [
        { type: 'text', text: 'This country is rich in ' },
        {
          type: 'choices',
          choices: [
            { choice: 'gas', isCorrect: false, isSelected: false },
            { choice: 'fuel', isCorrect: false, isSelected: false },
            { choice: 'oil', isCorrect: true, isSelected: false },
            { choice: 'linseed', isCorrect: false, isSelected: false },
            { choice: 'ethanol', isCorrect: false, isSelected: false },
            { choice: 'liquid', isCorrect: false, isSelected: false },
          ],
        },
        { type: 'text', text: '.' },
      ],
    } as any,
  },
};
