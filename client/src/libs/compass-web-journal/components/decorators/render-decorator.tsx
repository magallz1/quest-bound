import { ContentBlock } from 'draft-js';

/*
  Only here as a demo for future custom blocks. 
 */

type CustomBlockType = 'custom-type-list';

export const renderDecorator = (type: CustomBlockType, props: any) => {
  switch (type) {
    case 'custom-type-list':
      return <span>Any component</span>;
    default:
      return <></>;
  }
};

function CustomBlock(props: any) {
  const { block, contentState } = props;
  const data = contentState.getEntity(block.getEntityAt(0)).getData();
  const blocktype = contentState.getEntity(block.getEntityAt(0)).getType();

  return renderDecorator(blocktype, data);
}

export function renderCustomBlocks(contentBlock: ContentBlock) {
  const type = contentBlock.getType();
  if (type === 'atomic') {
    return {
      component: CustomBlock,
      editable: true,
    };
  }
}
