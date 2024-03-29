/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  '/feedback/compute': {
    /**
     * Computes feedback for the bit
     * @description This operation gives its consumers access to our formative feedback. The bit that is supplied in the request
     * is required for context and shall be included on every request. This way we avoid any synchronization problems
     * that otherwise will occur, where feedback was returned based on some outdated state of the bit.
     *
     * For identifying inputs belonging to the same bit, the `feedbackId` field on the `FeedbackEngine` object itself is of importance. This field
     * shall represent the identifier of the bit s.t. existing feedback can be re-used.
     * When this field remains the same across requests but other bit fields change, then for some existing bit _t_ the fields will be updated
     * and the feedback will be generated based on previously seen inputs and created feedback belonging to that bit _b_ (`*`).
     * On the other side, when the value for the `feedbackId` field was not yet seen by the system, a new bit _b'_ will be created. Consequently, there are
     * no existing inputs and thus also no feedback assigned that belong to the bit _b'_ yet. Therefore, consider only changing the identifier when you wish to
     * create a brand new bit.
     *
     * (`*`) This does only hold as long as the types are the same. When for some request the bit type is different to what already exists
     * due to previous requests, then an error will be returned.
     *
     * ---
     *
     * Further, as of now, bits are always created within the default tenant. There is no way currently to create a bit in a different tenant through the API.
     *
     * **Important note on bit updates**: each time a bit gets changed on the consumer's system, one should assume those changes
     * impact the feedback. Hence, we advise in such situations to test the feedback and create new inputs, as well as
     * potentially re-assign existing feedback for previous inputs, in order to adjust the feedback to those changes.
     * Without those measures, generated feedback may not be accurate anymore.
     */
    post: operations['computeFeedback'];
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    Bit: {
      type: components['schemas']['BitType'];
      format: components['schemas']['BitFormat'];
      feedbackEngine: components['schemas']['BitFeedbackEngine'];
      meta?: components['schemas']['BitMeta'];
      instruction: string;
    };
    /**
     * @description Defines the type of bit. Can be used by deserialization tools to instanciate the correct sub-type.
     * @enum {string}
     */
    BitType: 'essay' | 'cloze' | 'multiple-choice-text';
    /** @description Allowed values: `text` , `bitmark--` , `bitmark+` , `bitmark++` */
    BitFormat: string;
    BitFeedbackEngine: {
      feedbackId: string;
      /**
       * @description The identifier of the tenant. If omitted, the domain's default tenant will be used.
       * Make sure the API user has the required permissions on the target tenant to create and or update a task,
       * otherwise an [error-response](http://localhost:60000/documentation#tag/error_response_model) of type `MISSING_PERMISSIONS` will be returned.
       */
      tenantId?: number;
      userId: string;
      /**
       * @description The time in seconds it took the user to answer the bit. While this field is not mandatory, it may
       * eventually impact the performance of bit recommendations for the student. Hence, it is recommended to track
       * and set this field.
       *
       * @default 0
       */
      timeOnTask?: number;
    };
    BitMeta: {
      /**
       * @description This is the language a Bit is written in.
       *
       * @default en
       */
      language?: string;
      /**
       * @description For language learning material, this is the language to be learned/teached.
       *
       * @default en
       */
      learningLanguage?: string;
      /** @description This is the subject of the bit which is of internal use only. It has no impact on the feedback. */
      subject?: string;
    };
    ClozeBit: {
      type: 'cloze';
    } & Omit<components['schemas']['Bit'], 'type'> & {
        feedback: readonly components['schemas']['FeedbackItem'][];
        /**
         * @example [
         *   {
         *     "type": "text",
         *     "text": "This sentence is a "
         *   },
         *   {
         *     "type": "gap",
         *     "solutions": [
         *       "cloze",
         *       "gap text"
         *     ],
         *     "isCaseSensitive": true,
         *     "answer": {
         *       "text": "lorem"
         *     }
         *   },
         *   {
         *     "type": "text",
         *     "text": " with "
         *   },
         *   {
         *     "type": "gap",
         *     "solutions": [
         *       "two"
         *     ],
         *     "isCaseSensitive": true,
         *     "answer": {
         *       "text": "ipsum"
         *     }
         *   },
         *   {
         *     "type": "text",
         *     "text": " gaps including an instruction for the first and a hint for the second gap."
         *   }
         * ]
         */
        body: components['schemas']['ClozeBitBodyElement'][];
      };
    ClozeBitBodyElement: {
      /** @enum {string} */
      type: 'gap' | 'text';
    };
    ClozeBitBodyText: {
      type: 'text';
    } & Omit<components['schemas']['ClozeBitBodyElement'], 'type'> & {
        text: string;
      };
    ClozeBitBodyGap: {
      type: 'gap';
    } & Omit<components['schemas']['ClozeBitBodyElement'], 'type'> & {
        /**
         * @example [
         *   "cloze",
         *   "gap text"
         * ]
         */
        solutions: string[];
        instruction?: string;
        isCaseSensitive?: boolean;
        answer: components['schemas']['TextAnswer'];
        feedback: readonly components['schemas']['FeedbackItem'][];
      };
    EssayBit: {
      type: 'essay';
    } & Omit<components['schemas']['Bit'], 'type'> & {
        feedback: readonly components['schemas']['EssayBitFeedbackItem'][];
        /** @description A sample answer to the problem statement that is considered being correct. */
        sampleSolution: string;
        /** @description An answer input field of the problem statement. */
        answer: components['schemas']['TextAnswer'];
        /** @description A media file of the task. */
        resource?: components['schemas']['EssayBitResource'];
      };
    EssayBitFeedbackItem: components['schemas']['FeedbackItem'] &
      components['schemas']['EssayBitFeedbackItemContext'];
    EssayBitFeedbackItemContext: {
      /**
       * @description The context specifies the part of the answer, for which this feedback is meant for.
       * If the array is empty, the feedback is meant for the whole answer
       */
      context: {
        /** @description The content of this answer part. Added for convenience, can also be retrieved from the answer through offset and length. */
        content: string;
        /** @description The offset in the full answer. */
        offset: number;
        /** @description The length of this answer part. */
        length: number;
      }[];
    };
    TextAnswer: {
      text?: string;
    };
    /** @description The object holding information about the audio file. */
    EssayBitResource: {
      /**
       * @description The supported type of the media file.
       * @enum {string}
       */
      type: 'audio';
      audio: {
        /**
         * @description The format of the audio file.
         * @enum {string}
         */
        format: 'mp3';
        /** @description A URL pointing to the audio for the target sentence. */
        src: string;
      };
    };
    /**
     * @description The correctness levels.
     * @enum {string}
     */
    Correctness: 'CORRECT' | 'PARTIAL' | 'WRONG' | 'UNKNOWN';
    Topic: {
      /** @description The name of the topic */
      name: string;
    };
    FeedbackItem: {
      correctness: components['schemas']['Correctness'];
      topic?: components['schemas']['Topic'];
      /** @description The feedback message. */
      message: string;
    };
    MultipleChoiceTextBit: {
      type: 'multiple-choice-text';
    } & Omit<components['schemas']['Bit'], 'type'> & {
        feedback: readonly components['schemas']['FeedbackItem'][];
        /**
         * @example [
         *   {
         *     "type": "text",
         *     "text": "This sentence is a "
         *   },
         *   {
         *     "type": "choices",
         *     "choices": [
         *       {
         *         "choice": "multiple choice text",
         *         "isCorrect": true,
         *         "isSelected": false
         *       },
         *       {
         *         "choice": "gap text",
         *         "isCorrect": false,
         *         "isSelected": true
         *       }
         *     ],
         *     "instruction": "select one of the choices"
         *   },
         *   {
         *     "type": "text",
         *     "text": " with "
         *   },
         *   {
         *     "type": "choices",
         *     "choices": [
         *       {
         *         "choice": "one",
         *         "isCorrect": false,
         *         "isSelected": false
         *       },
         *       {
         *         "choice": "two",
         *         "isCorrect": true,
         *         "isSelected": true
         *       }
         *     ],
         *     "hint": "include this choice into the count"
         *   },
         *   {
         *     "type": "text",
         *     "text": " choices including an instruction for the first and a hint for the second gap."
         *   }
         * ]
         */
        body: components['schemas']['MultipleChoiceTextBodyElement'][];
      };
    MultipleChoiceTextBodyElement: {
      /** @enum {string} */
      type: 'choices' | 'text';
    };
    MultipleChoiceText: {
      type: 'text';
    } & Omit<components['schemas']['MultipleChoiceTextBodyElement'], 'type'> & {
        text: string;
      };
    MultipleChoiceTextChoices: {
      type: 'choices';
    } & Omit<components['schemas']['MultipleChoiceTextBodyElement'], 'type'> & {
        choices: components['schemas']['MultipleChoiceTextChoice'][];
        feedback: readonly components['schemas']['FeedbackItem'][];
      };
    MultipleChoiceTextChoice: {
      choice: string;
      instruction?: string;
      hint?: string;
      isCorrect: boolean;
      isSelected: boolean;
    };
    /**
     * @description Errors the API may respond with. For further explanations check the [error table](#section/Error-Types).
     * @example REQUEST_SCHEMA_MALFORMED
     * @enum {string}
     */
    ErrorType:
      | 'REQUEST_SCHEMA_MALFORMED'
      | 'INVALID_TOKEN'
      | 'MISSING_PERMISSIONS'
      | 'INVALID_PARAMETER'
      | 'WRONG_TASK_TYPE_FOR_UPSERT'
      | 'INTERNAL';
    ErrorResponse: {
      /**
       * @description Holds more detailed information on the root cause of the problem.
       * @example computeFeedback.feedbackEngine.userId must not be null.
       */
      message: string;
      type: components['schemas']['ErrorType'];
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type external = Record<string, never>;

export interface operations {
  /**
   * Computes feedback for the bit
   * @description This operation gives its consumers access to our formative feedback. The bit that is supplied in the request
   * is required for context and shall be included on every request. This way we avoid any synchronization problems
   * that otherwise will occur, where feedback was returned based on some outdated state of the bit.
   *
   * For identifying inputs belonging to the same bit, the `feedbackId` field on the `FeedbackEngine` object itself is of importance. This field
   * shall represent the identifier of the bit s.t. existing feedback can be re-used.
   * When this field remains the same across requests but other bit fields change, then for some existing bit _t_ the fields will be updated
   * and the feedback will be generated based on previously seen inputs and created feedback belonging to that bit _b_ (`*`).
   * On the other side, when the value for the `feedbackId` field was not yet seen by the system, a new bit _b'_ will be created. Consequently, there are
   * no existing inputs and thus also no feedback assigned that belong to the bit _b'_ yet. Therefore, consider only changing the identifier when you wish to
   * create a brand new bit.
   *
   * (`*`) This does only hold as long as the types are the same. When for some request the bit type is different to what already exists
   * due to previous requests, then an error will be returned.
   *
   * ---
   *
   * Further, as of now, bits are always created within the default tenant. There is no way currently to create a bit in a different tenant through the API.
   *
   * **Important note on bit updates**: each time a bit gets changed on the consumer's system, one should assume those changes
   * impact the feedback. Hence, we advise in such situations to test the feedback and create new inputs, as well as
   * potentially re-assign existing feedback for previous inputs, in order to adjust the feedback to those changes.
   * Without those measures, generated feedback may not be accurate anymore.
   */
  computeFeedback: {
    requestBody?: {
      content: {
        'application/json': components['schemas']['Bit'];
      };
    };
    responses: {
      /** @description successful operation */
      200: {
        content: {
          'application/json': components['schemas']['Bit'];
        };
      };
      /** @description The request is malformed. Might be due to an invalid or missing authorization field or wrong schema in the request body. */
      400: {
        content: {
          'application/json': components['schemas']['ErrorResponse'] &
            Record<string, never>;
        };
      };
      /** @description There was an internal server error. Although unlikely to occur, in case, the message will include an identifier for a quick trace-back. */
      500: {
        content: {
          'application/json': components['schemas']['ErrorResponse'] &
            Record<string, never>;
        };
      };
    };
  };
}
