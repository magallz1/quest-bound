import MUISlider, { SliderProps as MUISliderProps } from '@mui/material/Slider';

export type SliderProps = MUISliderProps;

export const Slider = ({ ...baseProps }: SliderProps): JSX.Element => <MUISlider {...baseProps} />;
