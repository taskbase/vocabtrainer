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

export const FEEDBACK_CORRECT_MOCK_RESPONSE = feedbackFactory('CORRECT');
export const FEEDBACK_WRONG_MOCK_RESPONSE = feedbackFactory('WRONG');

function feedbackFactory(correctness: 'CORRECT' | 'WRONG') {
  return {
    feedback: [
      {
        correctness: correctness,
        topic: { name: '' },
        message: "The answer mentions the keywords we were looking for: 'Oil'",
        context: [
          { content: 'This country is rich in oil', offset: 0, length: 27 },
        ],
      },
    ],
    sampleSolution: 'This country is rich in oil.',
    answer: { text: 'This country is rich in oil' },
    resource: {
      type: 'audio',
      audio: {
        format: 'mp3',
        src: 'http://taskpool.taskbase.com/audio/EN-59246.mp3',
      },
    },
    type: 'essay',
    format: 'text',
    feedbackEngine: {
      feedbackId: 'fb182030db4e218d5708642beb33cf25-essay',
      tenantId: 99,
      userId: 'XXXXXX',
      timeOnTask: 0,
    },
    meta: { language: 'de', learningLanguage: 'en', subject: 'oil' },
    instruction: 'Übersetzen Sie den Satz: "Dieses Land ist reich an Öl."',
  };
}

export const SUCCESS_MESSAGES = [
  'Correct! You are a hero!',
  'Correct! That’s how we do it in the marvel universe!',
  'Correct! King!',
  'Correct! My grandmother would say: Lit!',
  'You nailed it!',
  'Like a boss!',
  'Not expected differently: Correct!',
  'Perfect! No Cap!',
  'No way: Correct. Is your name Albert?',
  "Well done! You're a superstar!",
  "Way to go! That's how things are done in the DC universe!",
  "Spot on! You're the king of this task!",
  'Awesome! My grandfather would say: Groovy!',
  'Excellent job! You crushed it!',
  'Impressive! You handled that like a pro!',
  'Of course! Correct was the only option!',
  'Fantastic! You hit the bullseye!',
  "That's right! Are you a genius or what?",
  'Unbelievable! Correct. Are you secretly Einstein?',
  "Great job! You're a champ!",
  "Perfectly executed! You're a hero in your own right!",
  "You're killing it! That's how they do it in the superhero movies!",
  "Bravo! You're the ruler of this task!",
  "You're on fire! My sister would say: On fleek!",
  'Terrific work! You aced it!',
  "You're the best! Like a true boss!",
  'Exactly right! No doubt about it!',
  'Amazing! You knocked it out of the park!',
  'Unmistakable! Correct. Are you a mind-reader?',
];
