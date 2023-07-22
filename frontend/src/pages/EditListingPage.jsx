import React from "react";
import { useParams } from "react-router-dom";
import CreateListingPage from "./CreateListingPage";

const EditListingPage = () => {
  const params = useParams();
  const { id } = params;
  return (
    <React.Fragment>
      <CreateListingPage listingId={ id }/>
    </React.Fragment>
  );
}

export default EditListingPage;