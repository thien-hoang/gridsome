module.exports = {
  PAGED_ROUTE: 'paged',
  STATIC_ROUTE: 'static',
  STATIC_TEMPLATE_ROUTE: 'static_template',
  DYNAMIC_TEMPLATE_ROUTE: 'dynamic_template',

  NORMAL_PLUGIN: 'plugin',
  SOURCE_PLUGIN: 'source',
  TRANSFORMER_PLUGIN: 'transformer',

  SUPPORTED_IMAGE_TYPES: ['.png', '.jpeg', '.jpg', '.gif', '.svg', '.webp'],

  BOOTSTRAP_CONFIG: 0,
  BOOTSTRAP_PLUGINS: 1,
  BOOTSTRAP_GRAPHQL: 2,
  BOOTSTRAP_FULL: Number.MAX_SAFE_INTEGER,

  internalRE: /^internal\:\/\//,
  transformerRE: /(?:^@?gridsome[/-]|\/)transformer-([\w-]+)/,

  ISO_8601_FORMAT: [
    'YYYY',
    'YYYY-MM',
    'YYYY-MM-DD',
    'YYYYMMDD',

    // Local Time
    'YYYY-MM-DDTHH',
    'YYYY-MM-DDTHH:mm',
    'YYYY-MM-DDTHHmm',
    'YYYY-MM-DDTHH:mm:ss',
    'YYYY-MM-DDTHHmmss',
    'YYYY-MM-DDTHH:mm:ss.SSS',
    'YYYY-MM-DDTHHmmss.SSS',

    // Coordinated Universal Time (UTC)
    'YYYY-MM-DDTHHZ',
    'YYYY-MM-DDTHH:mmZ',
    'YYYY-MM-DDTHHmmZ',
    'YYYY-MM-DDTHH:mm:ssZ',
    'YYYY-MM-DDTHHmmssZ',
    'YYYY-MM-DDTHH:mm:ss.SSSZ',
    'YYYY-MM-DDTHHmmss.SSSZ',

    'YYYY-[W]WW',
    'YYYY[W]WW',
    'YYYY-[W]WW-E',
    'YYYY[W]WWE',
    'YYYY-DDDD',
    'YYYYDDDD'
  ]
}

