import { Handle } from 'reactflow';
import { IOHandle, ioTypeToIcon } from '../node-data';

export const CustomHandle = (props: IOHandle) => {
  return (
    <Handle
      id={props.id}
      className={props.type}
      type={props.type}
      position={props.position}
      style={{
        height: '24px',
        width: '24px',
        backgroundColor: 'unset',
        border: 'unset',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...(props.position === 'right' && {
          right: '4px',
        }),
        ...(props.position === 'left' && {
          left: '4px',
        }),
        ...(props.top && {
          top: props.top,
        }),
        ...(props.bottom && {
          bottom: props.bottom,
        }),
      }}>
      {ioTypeToIcon.get(props.ioType)}
    </Handle>
  );
};
