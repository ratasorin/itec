import { PickerActionBlueprint } from '../../../../widgets/popups/components/Picker/picker.slice';
import { Selection, Area } from 'd3';

interface Dependencies {
  container: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  area: Area<number>;
  openPopup: (props: PickerActionBlueprint) => void;
}

export interface IntervalProps {
  id: string;
  start: string;
  end: string;
  name: string | null;
}

export const prepareDrawInterval =
  ({ area, openPopup, container }: Dependencies) =>
  ({ end, id, name, start }: IntervalProps) => {
    return container
      .append('path')
      .attr('d', area([new Date(start).getTime(), new Date(end).getTime()]))
      .attr('fill', name ? 'red' : 'green')
      .on('mouseover', (event: MouseEvent) => {
        const { left, top, height, width } = (
          event.currentTarget as HTMLElement
        ).getBoundingClientRect();

        openPopup({
          payload: {
            id,
            interval: {
              end,
              occupantName: name,
              start,
            },
          },
          specification: {
            box: {
              height,
              width,
              left,
              top,
            },
          },
        });
      });
  };
