import { useMemo, useState } from 'react';
import { useWidgetBlueprint } from '../../../hooks/useWidgetBlueprints';
import { DetailsActionBlueprint, DetailsPopupBlueprint } from './details.slice';
import { Button } from '@mui/material';
import useDimensions from '../../../../hooks/dimensions';
import useHandleClickOutside from '../../../../hooks/click-outside';
import { useWidgetActions } from '../../../hooks/useWidgetActions';

const DetailsPopup = () => {
  const { payload, specification } =
    useWidgetBlueprint<DetailsPopupBlueprint>('details-popup');
  const { close } = useWidgetActions<DetailsActionBlueprint>('details-popup');

  useHandleClickOutside('details-popup', close);

  const [popup, setPopup] = useState<HTMLDivElement | null>(null);
  const dimensions = useDimensions(popup);
  const { left, top } = useMemo(() => {
    if (!dimensions || !specification.box) return { left: null, top: null };
    const {
      left: containerLeft,
      top: containerTop,
      width: containerWidth,
    } = specification.box;
    const { width: popupWidth, height: popupHeight } = dimensions;

    return {
      left: containerLeft + containerWidth / 2 - popupWidth / 2,
      top: containerTop - popupHeight - 20,
    };
  }, [dimensions, specification]);

  if (!specification.render) return null;
  return (
    <div
      id="details-popup"
      ref={setPopup}
      style={{
        visibility: top && left ? 'visible' : 'hidden',
        top: top || 0,
        left: left || 0,
      }}
      className="absolute z-50 flex flex-col items-start justify-start rounded-md bg-white p-6 align-middle shadow-md"
    >
      <span className="pb-3">
        Booked by {payload.occupantName || ''}, until{' '}
        {new Date(payload.booked_until || '').toLocaleTimeString()}
      </span>
      <Button variant="outlined" className="w-auto">
        BOOK NEXT
      </Button>
    </div>
  );
};

export default DetailsPopup;
