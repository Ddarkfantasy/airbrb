import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HostingHeader from '../components/HostingHeader';
import { getSingleListing } from '../config/requests';
import { useSnackbar } from 'notistack';
import PublishEditForm from '../components/PublishEditForm';



const GoLivePage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();



  const [itemInfo, setItemInfo] = useState({});
  // get listing id from url
  const params = useParams();
  const { id } = params;

  // get data of availability of the listing
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
    } else {
      const fetchListing = async () => {
        const res = await getSingleListing(id);
        if (res.ok) {
          setItemInfo({
            availability:res.data.listing.availability,
            id: id,
          });
        } else {
          enqueueSnackbar(res.error, { variant: 'warning' });
          navigate('/hosting');
        }
      }
      fetchListing();
    }
  }, [enqueueSnackbar, id, navigate]);
  return (
    <React.Fragment>
      <HostingHeader />
      <PublishEditForm itemInfo={itemInfo} />
    </React.Fragment>
  )
}

export default GoLivePage;