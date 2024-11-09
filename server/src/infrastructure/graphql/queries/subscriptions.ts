/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const streamCharacter = /* GraphQL */ `
  subscription StreamCharacter($id: String!) {
    streamCharacter(id: $id) {
      id
      rulesetId
      rulesetTitle
      username
      createdFromPublishedRuleset
      name
      description
      attributes {
        id
        rulesetId
        moduleId
        moduleTitle
        name
        description
        data
        type
        defaultValue
        minValue
        maxValue
        category
        restraints
        logic
        sortChildId
        image {
          id
          src
          name
          sortIndex
          parentId
          details
        }
        variation
        source
        sourceId
      }
      pages {
        id
        sheetId
        rulesetId
        archetypeId
        characterId
        title
        details
        content
        sortIndex
        parentId
        sheet {
          id
          rulesetId
          pageId
          rulesetTitle
          type
          templateId
          templateName
          templateType
          userId
          username
          version
          title
          description
          image {
            id
            src
            name
            sortIndex
            parentId
            details
          }
          backgroundImage {
            id
            src
            name
            sortIndex
            parentId
            details
          }
          details
          components {
            id
            sheetId
            rulesetId
            type
            label
            description
            images {
              id
              src
              name
              sortIndex
              parentId
              details
            }
            locked
            tabId
            layer
            style
            data
            groupId
            x
            y
            width
            height
            rotation
          }
          tabs
        }
      }
      attributeData
      itemData
      image {
        id
        src
        name
        sortIndex
        parentId
        details
      }
      sheet {
        id
        rulesetId
        pageId
        rulesetTitle
        type
        templateId
        templateName
        templateType
        userId
        username
        version
        title
        description
        image {
          id
          src
          name
          sortIndex
          parentId
          details
        }
        backgroundImage {
          id
          src
          name
          sortIndex
          parentId
          details
        }
        details
        components {
          id
          sheetId
          rulesetId
          type
          label
          description
          images {
            id
            src
            name
            sortIndex
            parentId
            details
          }
          locked
          tabId
          layer
          style
          data
          groupId
          x
          y
          width
          height
          rotation
        }
        tabs
      }
      streamTabId
    }
  }
`;
export const streamComponents = /* GraphQL */ `
  subscription StreamComponents($input: GetSheetComponents!) {
    streamComponents(input: $input) {
      id
      sheetId
      rulesetId
      type
      label
      description
      images {
        id
        src
        name
        sortIndex
        parentId
        details
      }
      locked
      tabId
      layer
      style
      data
      groupId
      x
      y
      width
      height
      rotation
    }
  }
`;
