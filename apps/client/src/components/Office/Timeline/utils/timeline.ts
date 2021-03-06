import type { OfficeTimeIntervalDB } from '@shared';
import { useWidgetActions } from '../../../../widgets/hooks/useWidgetActions';
import * as d3 from 'd3';
import { PickerActionBlueprint } from '../../../../widgets/popups/components/Picker/picker.slice';
import { prepareDrawInterval } from './interval';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../hooks/redux/redux.hooks';
import { useCallback, useMemo } from 'react';
import { D3BrushEvent } from 'd3';
import { alterBounds } from '../timeline.slice';

const PADDING = 90;
const HEIGHT = 150;

const useDrawTimeline = (id: string, width: number, brushing: boolean) => {
  const DIMENSIONS = useMemo(() => {
    console.log({
      width: width - 2 * PADDING,
      height: HEIGHT,
    });

    return {
      width: width - 2 * PADDING,
      height: HEIGHT,
    };
  }, [width]);

  const dispatch = useAppDispatch();
  const { open } = useWidgetActions<PickerActionBlueprint>('picker-popup');

  //set scales
  const { selectedRange } = useAppSelector(({ timeline }) => timeline);

  const { end: chartEndsAt, start: chartStartsAt } = selectedRange;

  const xScale = useMemo(() => {
    console.log(chartEndsAt);
    return d3
      .scaleTime()
      .domain([chartStartsAt, chartEndsAt])
      .range([0, DIMENSIONS.width]);
  }, [DIMENSIONS, chartEndsAt, chartStartsAt]);

  const yScale = useMemo(
    () => d3.scaleLinear().range([DIMENSIONS.height, 0]),
    [DIMENSIONS]
  );

  // const wrapper = useMemo(() => {}, [DIMENSIONS]);
  const bookedArea = useMemo(
    () =>
      d3
        .area<number>()
        .x((d) => xScale(d))
        .y0(DIMENSIONS.height)
        .y1(() => yScale(1))
        .curve(d3.curveStepBefore),
    [DIMENSIONS, xScale, yScale]
  );

  const cb = useCallback(
    (intervals: OfficeTimeIntervalDB[]) => {
      d3.select('.timetable').remove();
      const wrapper = d3
        .select('#timeline')
        .append('svg')
        .attr('class', 'timetable')
        .attr('width', DIMENSIONS.width)
        .attr('height', DIMENSIONS.height + 100)
        .attr('fill', 'red')
        .attr('viewBox', `0 0 ${DIMENSIONS.width} ${DIMENSIONS.height}`);

      const brush = d3
        .brushX()
        .extent([
          [0, 0],
          [DIMENSIONS.width, DIMENSIONS.height],
        ])
        .on('end', (event: D3BrushEvent<unknown>, data) => {
          if (!event.selection) return;
          const [x1, x2] = event.selection as [number, number];
          const start = xScale.invert(x1);
          const end = xScale.invert(x2);
          dispatch(
            alterBounds({ interval: { end, start }, update: 'selectedRange' })
          );
          console.log({ start, end });
        });

      const scale = wrapper
        .append('g')
        .attr('transform', 'translate(0,' + DIMENSIONS.height + ')')
        .call(d3.axisBottom(xScale));

      const container = wrapper.append('g');
      if (brushing) wrapper.append('g').call(brush);

      const drawInterval = prepareDrawInterval({
        area: bookedArea,
        openPopup: open,
        container,
      });

      if (!intervals.length)
        return drawInterval({
          end: new Date(chartEndsAt).toISOString(),
          id,
          name: null,
          start: new Date().toISOString(),
        });

      drawInterval({
        end: new Date(chartEndsAt).toISOString(),
        id,
        name: '-',
        start: new Date().toISOString(),
      });

      return intervals.forEach(
        ({
          booked_from,
          booked_until,
          free_from,
          free_until,
          occupantName,
        }) => {
          drawInterval({
            end: new Date(booked_until).toISOString(),
            id,
            name: occupantName,
            start: new Date(booked_from).toISOString(),
          });
          drawInterval({
            end: new Date(free_until || chartEndsAt).toISOString(),
            id,
            name: null,
            start: new Date(free_from).toISOString(),
          });
        }
      );
    },
    [chartEndsAt, id, brushing]
  );

  return cb;
};

export default useDrawTimeline;
