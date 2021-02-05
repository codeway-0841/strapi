import sanitizeSchema from '../sanitizeCTBContentTypeSchema';

describe('i18n | utils | sanitizeCTBContentTypeSchema', () => {
  it('should forward the data the pluginOptions.i18n.localized key does not exist in the content type', () => {
    const data = { pluginOptions: { test: true } };

    expect(sanitizeSchema(data)).toEqual(data);
  });

  it('should remove the pluginOptions.i18n key from the content type schema', () => {
    const ctSchema = {
      pluginOptions: {
        pluginA: { foo: 'bar' },
        i18n: { localized: false },
        pluginB: { foo: 'bar' },
      },
      kind: 'test',
      attributes: {
        one: {
          type: 'string',
          pluginOptions: {
            i18n: { localized: true },
          },
          required: true,
        },
        two: {
          type: 'number',
          pluginOptions: {
            pluginA: { test: true },
            i18n: { localized: true },
          },
        },
      },
    };

    const expected = {
      pluginOptions: {
        pluginA: { foo: 'bar' },
        pluginB: { foo: 'bar' },
      },
      kind: 'test',
      attributes: {
        one: {
          type: 'string',
          pluginOptions: {},
          required: true,
        },
        two: {
          type: 'number',
          pluginOptions: {
            pluginA: { test: true },
          },
        },
      },
    };

    expect(sanitizeSchema(ctSchema, {})).toEqual(expected);
  });

  it('should return the data if the initial schema already has i18n enabled', () => {
    const ctSchema = {
      pluginOptions: {
        pluginA: { foo: 'bar' },
        i18n: { localized: true },
        pluginB: { foo: 'bar' },
      },
      kind: 'test',
      attributes: {
        one: {
          type: 'string',
          pluginOptions: {
            i18n: { localized: true },
          },
          required: true,
        },
        two: {
          type: 'number',
          pluginOptions: {
            pluginA: { test: true },
            i18n: { localized: true },
          },
        },
      },
    };

    expect(
      sanitizeSchema(ctSchema, {
        pluginOptions: {
          pluginA: { foo: 'bar' },
          i18n: { localized: true },
          pluginB: { foo: 'bar' },
        },
      })
    ).toEqual(ctSchema);
  });

  it('should set the pluginOptions.i18n.localized to true an all attributes', () => {
    const nextSchema = {
      pluginOptions: { pluginA: { ok: true }, i18n: { localized: true } },
      attributes: {
        cover: { type: 'media', pluginOptions: { pluginA: { ok: true } } },
        name: {
          type: 'text',
          pluginOptions: { pluginA: { ok: true }, i18n: { localized: false } },
        },
        price: {
          type: 'text',
        },
      },
    };
    const expected = {
      pluginOptions: { pluginA: { ok: true }, i18n: { localized: true } },
      attributes: {
        cover: {
          type: 'media',
          pluginOptions: { pluginA: { ok: true } },
        },
        name: {
          type: 'text',
          pluginOptions: { pluginA: { ok: true }, i18n: { localized: true } },
        },
        price: {
          type: 'text',
          pluginOptions: { i18n: { localized: true } },
        },
      },
    };

    expect(sanitizeSchema(nextSchema, {})).toEqual(expected);
  });
});
