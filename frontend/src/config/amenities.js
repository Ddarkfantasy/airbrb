import { Waves, HotTub, Deck, OutdoorGrill, Fireplace, LocalFireDepartment, FitnessCenter, YardOutlined,
  RadarOutlined, CrisisAlert, MedicalServices, FireExtinguisher,
  Wifi, Countertops, Tv, LocalLaundryService, DirectionsCar, RequestQuote, AcUnit, HeatPump, WorkOutline, ShowerOutlined } from '@mui/icons-material';

export const amenitiesConfig = {
  'standout': {
    'Pool': <Waves/>,
    'Hot Tub': <HotTub/>,
    'Patio': <YardOutlined/>,
    'BBQ grill': <OutdoorGrill/>,
    'Fire pit': <LocalFireDepartment/>,
    'Indoor fireplace': <Fireplace/>,
    'Outdoor dining area': <Deck/>,
    'Exercise equipment': <FitnessCenter/>,
  },
  'basics': {
    'Wi-Fi': <Wifi/>,
    'Kitchen': <Countertops/>,
    'TV': <Tv/>,
    'Washing machine': <LocalLaundryService/>,
    'Free parking': <DirectionsCar/>,
    'Paid parking': <RequestQuote/>,
    'Air conditioning': <AcUnit/>,
    'Heating': <HeatPump/>,
    'Dedicated workspace': <WorkOutline/>,
    'Outdoor shower': <ShowerOutlined/>,
  },
  'safety': {
    'Smoke alarm': <RadarOutlined/>,
    'Carbon monoxide alarm': <CrisisAlert/>,
    'First aid kit': <MedicalServices/>,
    'Fire extinguisher': <FireExtinguisher/>,
  },
}