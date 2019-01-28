const { isEmpty } = require('lodash')
const camelCase = require('camelcase')
const { isDate } = require('./types/date')

const {
  GraphQLInt,
  GraphQLList,
  GraphQLFloat,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInputObjectType
} = require('../graphql')

class GraphQLInputFilterObjectType extends GraphQLInputObjectType {}
class GraphQLInputFilterReferenceType extends GraphQLInputObjectType {}

function createFilterTypes (fields, typeName) {
  const types = {}

  for (const key in fields) {
    const type = createFilterType(fields[key], key, typeName)

    if (type) {
      types[key] = { type }
    }
  }

  return types
}

function createFilterType (value, fieldName, typeName) {
  const defaultDescription = `Filter ${typeName} nodes by ${fieldName}`

  if (isRefField(value)) {
    return new GraphQLInputFilterReferenceType({
      name: createFilterName(typeName, fieldName),
      description: defaultDescription,
      fields: value.isList
        ? {
          size: { type: GraphQLInt, description: desc.size },
          contains: { type: new GraphQLList(GraphQLString), description: desc.contains },
          containsAny: { type: new GraphQLList(GraphQLString), description: desc.containsAny },
          containsNone: { type: new GraphQLList(GraphQLString), description: desc.containsNone }
        }
        : {
          eq: { type: GraphQLString, description: desc.eq },
          ne: { type: GraphQLString, description: desc.ne },
          regex: { type: GraphQLString, description: desc.regex },
          in: { type: new GraphQLList(GraphQLString), description: desc.in },
          nin: { type: new GraphQLList(GraphQLString), description: desc.nin }
        }
    })
  }

  if (isDate(value)) {
    return new GraphQLInputFilterObjectType({
      name: createFilterName(typeName, fieldName),
      description: defaultDescription,
      fields: {
        dteq: { type: GraphQLString, description: desc.dteq },
        gt: { type: GraphQLString, description: desc.gt },
        gte: { type: GraphQLString, description: desc.gte },
        lt: { type: GraphQLString, description: desc.lt },
        lte: { type: GraphQLString, description: desc.lte },
        between: { type: new GraphQLList(GraphQLString), description: desc.between }
      }
    })
  }

  if (Array.isArray(value)) {
    const valueType = toGraphQLType(value[0])

    return valueType ? new GraphQLInputFilterObjectType({
      name: createFilterName(typeName, fieldName),
      description: defaultDescription,
      fields: {
        size: { type: GraphQLInt, description: desc.size },
        contains: { type: new GraphQLList(valueType), description: desc.contains },
        containsAny: { type: new GraphQLList(valueType), description: desc.containsAny },
        containsNone: { type: new GraphQLList(valueType), description: desc.containsNone }
      }
    }) : null
  }

  switch (typeof value) {
    case 'string' :
      return new GraphQLInputFilterObjectType({
        name: createFilterName(typeName, fieldName),
        description: defaultDescription,
        fields: {
          len: { type: GraphQLInt, description: desc.len },
          eq: { type: GraphQLString, description: desc.eq },
          ne: { type: GraphQLString, description: desc.ne },
          regex: { type: GraphQLString, description: desc.regex },
          in: { type: new GraphQLList(GraphQLString), description: desc.in },
          nin: { type: new GraphQLList(GraphQLString), description: desc.nin }
        }
      })

    case 'boolean' :
      return new GraphQLInputFilterObjectType({
        name: createFilterName(typeName, fieldName),
        fields: {
          eq: { type: GraphQLBoolean, description: desc.eq },
          ne: { type: GraphQLBoolean, description: desc.ne },
          in: { type: new GraphQLList(GraphQLBoolean), description: desc.in },
          nin: { type: new GraphQLList(GraphQLBoolean), description: desc.nin }
        }
      })

    case 'number':
      const numberType = toGraphQLType(value)

      return new GraphQLInputFilterObjectType({
        name: createFilterName(typeName, fieldName),
        description: defaultDescription,
        fields: {
          eq: { type: numberType, description: desc.eq },
          ne: { type: numberType, description: desc.ne },
          gt: { type: numberType, description: desc.gt },
          gte: { type: numberType, description: desc.gte },
          lt: { type: numberType, description: desc.lt },
          lte: { type: numberType, description: desc.lte },
          in: { type: new GraphQLList(numberType), description: desc.in },
          nin: { type: new GraphQLList(numberType), description: desc.nin },
          between: { type: new GraphQLList(numberType), description: desc.between }
        }
      })

    case 'object':
      return createObjectFilter(value, fieldName, typeName)
  }
}

function createObjectFilter (obj, fieldName, typeName) {
  const name = createFilterName(typeName, fieldName)
  const fields = {}

  for (const key in obj) {
    const type = createFilterType(obj[key], `${fieldName} ${key}`, typeName)

    if (type) {
      fields[key] = { type }
    }
  }

  return !isEmpty(fields)
    ? new GraphQLInputObjectType({ name, fields })
    : null
}

function createFilterName (typeName, key) {
  return camelCase(`${typeName} ${key} InputFilter`, { pascalCase: true })
}

function toGraphQLType (value) {
  const type = typeof value

  if (Array.isArray(value)) {
    return GraphQLList
  }

  switch (type) {
    case 'string' : return GraphQLString
    case 'boolean' : return GraphQLBoolean
    case 'number' : return is32BitInt(value) ? GraphQLInt : GraphQLFloat
  }
}

function is32BitInt (x) {
  return (x | 0) === x
}

function isRefField (field) {
  return (
    typeof field === 'object' &&
    Object.keys(field).length === 2 &&
    field.hasOwnProperty('typeName') &&
    field.hasOwnProperty('isList')
  )
}

const desc = {
  eq: 'Filter nodes by property of (strict) equality.',
  ne: 'Filter nodes by property not equal to provided value.',
  dteq: 'Filter nodes by date property equal to provided date value',
  gt: 'Filter nodes by property greater than provided value.',
  gte: 'Filter nodes by property greater or equal to provided value.',
  lt: 'Filter nodes by property less than provided value.',
  lte: 'Filter nodes by property less than or equal to provided value.',
  between: 'Filter nodes by property between provided values.',
  regex: 'Filter nodes by property matching provided regular expression.',
  in: 'Filter nodes by property matching any of the provided values.',
  nin: 'Filter nodes by property not matching any of the provided values.',
  contains: 'Filter nodes by property containing the provided value.',
  containsAny: 'Filter nodes by property containing any of the provided values.',
  containsNone: 'Filter nodes by property containing none of the provided values.',
  size: 'Filter nodes which have an array property of specified size.',
  len: 'Filter nodes which have a string property of specified length.'
}

module.exports = {
  createFilterType,
  createFilterTypes,
  GraphQLInputFilterObjectType,
  GraphQLInputFilterReferenceType
}