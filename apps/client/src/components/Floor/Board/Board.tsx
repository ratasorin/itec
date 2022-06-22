import { SpacesOnFloor } from '@shared';
import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useWidgetActions } from '../../../widgets/hooks/useWidgetActions';
import { DetailsActionBlueprint } from '../../../widgets/popups/components/Details/details.slice';

const Board: FC<{ offices: SpacesOnFloor[] }> = ({ offices }) => {
  const { open: openPopup } =
    useWidgetActions<DetailsActionBlueprint>('details-popup');
  const navigate = useNavigate();
  const { x, y } = useMemo(
    () =>
      offices.reduce(
        (prev, curr) => {
          if (curr.x + 1 > prev.x)
            return {
              x: curr.x + 1,
              y: curr.y + 1,
            };
          if (curr.x + 1 > prev.x)
            return {
              x: curr.x + 1,
              y: prev.y,
            };
          if (curr.y + 1 > prev.y)
            return {
              x: prev.x,
              y: curr.y + 1,
            };
          return prev;
        },
        { x: 1, y: 1 }
      ),
    [offices]
  );

  if (!offices.length) return <div>No spots found!</div>;

  return (
    <div
      className="grid aspect-square w-7/12 max-w-md rounded-2xl bg-slate-500"
      style={{
        gridTemplateColumns: `repeat(${y}, 1fr)`,
        gridTemplateRows: `repeat(${x}, 1fr)`,
      }}
    >
      {offices.map(
        ({ x, y, book_until, occupantName, space_id, officeName }) => (
          <div
            onMouseOver={({ currentTarget }) => {
              if (book_until)
                openPopup({
                  payload: {
                    occupantName,
                    officeName,
                    book_until,
                    space_id,
                    x,
                    y,
                  },
                  specification: {
                    box: currentTarget.getBoundingClientRect(),
                  },
                });
            }}
            onClick={() => {
              navigate(
                {
                  pathname: `/timetable/${space_id}`,
                },
                {
                  state: space_id,
                }
              );
            }}
            style={{
              backgroundColor: book_until ? 'red' : 'green',
              gridColumn: y + 1,
              gridRow: x + 1,
            }}
            className="bold flex h-1/2 w-1/2 cursor-pointer content-center items-center justify-center	justify-items-center self-center justify-self-center rounded-2xl text-3xl text-white shadow-lg shadow-slate-600 transition-all hover:scale-110"
          >
            {officeName}
          </div>
        )
      )}
    </div>
  );
};

export default Board;
