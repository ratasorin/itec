import { useLocation } from 'react-router';
import Board from '../../components/Floor/Board';
import Sidebar from '../../components/Floor/Sidebar/Sidebar';
import { useFloor } from '../slices/floor.slice';
import { useOffices } from './hooks/offices';
import { useFloors } from './hooks/floors';

const BuildingMenu = () => {
  const building_id = useLocation().state as string;
  const selectedFloorLevel = useFloor();
  const floors = useFloors(building_id);
  const offices = useOffices(building_id, selectedFloorLevel, undefined);

  console.log({ offices, building_id, selectedFloorLevel });

  return (
    <div className="flex h-auto w-screen flex-row bg-slate-500">
      <Sidebar floors={floors}></Sidebar>
      <div className="flex h-screen flex-1 items-center justify-center bg-amber-300">
        <Board offices={offices} />
      </div>
    </div>
  );
};

export default BuildingMenu;
