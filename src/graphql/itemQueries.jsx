import { gql } from '@apollo/client';

export const GET_ITEMS = gql`
  query GetItems {
    items {
      id
      name
      description
    }
  }
`;

export const GET_ITEM = gql`
  query GetItem($itemId: ID!) {
      item(id: $itemId) {
        id
        name
        description
        itemParts {
          id
          name
          description
          parentId
          children {
            id
            name
            description
            parentId
            children {
              id
              name
              description
              parentId
              itemPartAttributes {
                id
                name
                itemPartAttributeOptions {
                  id
                  name
                  price
                  stock
                  rules {
                    sourceOption {
                      id
                      name
                    }
                    targetOption {
                      id
                      name
                    }
                    targetPart {
                      id
                      name
                    }
                    ruleType
                    reciprocal
                    operation
                    value
                  }
                }
              }
            }
            itemPartAttributes {
              id
              name
              itemPartAttributeOptions {
                id
                name
                price
                stock
                rules {
                  sourceOption {
                    id
                    name
                  }
                  targetOption {
                    id
                    name
                  }
                  targetPart {
                    id
                    name
                  }
                  ruleType
                  reciprocal
                  operation
                  value
                }
              }
            }
          }
          itemPartAttributes {
            id
            name
            itemPartAttributeOptions {
              id
              name
              price
              stock
              rules {
                id
                sourceOption {
                  id
                  name
                }
                targetOption {
                  id
                  name
                }
                targetPart {
                  id
                  name
                }
                ruleType
                reciprocal
                operation
                value
              }
            }
          }
        }
      }
  }
`;



export const GET_ITEM_PARTS = gql`
    query($itemId: ID!) {
        item(id: $itemId) {
            id
            __typename
            name
            itemParts {
                id 
                __typename 
                name
                description
                children {
                    id
                }
            }
        }
    }
`;



export const GET_ITEM_PART_ATTRIBUTE_OPTIONS = gql`
    query($itemPartAttributeId: ID!) {
        itemPartAttribute(id: $itemPartAttributeId) {
            id  
            name
            itemPartAttributeOptions {
                id
                name
                price
                stock
                rules {
                    sourceOption {
                        id
                        name
                    }
                    targetOption {
                        id
                        name
                    }
                    targetPart {
                        id
                        name
                    }
                    ruleType
                    reciprocal
                    operation
                    value
                }
            }
        }
    }
`;

