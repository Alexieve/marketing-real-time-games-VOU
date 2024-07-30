import React, { useEffect, useState } from "react";
import { AppSidebar, AppFooter, AppHeader } from "../../../components/index";
import { Link } from "react-router-dom";
import axios from "axios";

import {
  CCard,
  CCardBody,
  CPagination,
  CPaginationItem,
  CFormInput,
  CRow,
  CCol,
  CCardTitle,
  CCardText,
  CButton,
  CCardImage,
} from "@coreui/react";

import "../../../scss/event/event.scss";

const Event = () => {
  const [voucherData, setVoucherData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = () => {
      axios
        .get("http://localhost:8000/vouchers")
        .then((response) => {
          setVoucherData(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching voucher data:", error);
        });
    };
    fetchData();
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8000/vouchers/${id}`)
      .then((response) => {
        if (response.status === 200) {
          // Remove the deleted voucher from the voucherData state
          setVoucherData(voucherData.filter((voucher) => voucher.id !== id));
          console.log("Event deleted successfully");
        } else {
          console.error("Failed to delete voucher");
        }
      })
      .catch((error) => {
        console.error("Error deleting voucher:", error);
      });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-GB", options);
  };

  const filteredItems = voucherData.filter(
    (voucher) =>
      voucher.code &&
      voucher.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1 m-2">
          <div className="d-flex mb-3">
            <CFormInput
              type="text"
              placeholder="Search events"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <CRow className="m-0">
            {currentItems.map((voucher) => (
              <CCol md="4" key={voucher.id} className="mb-4">
                <Link
                  to={`/voucher/create/${voucher.id}`}
                  className="card-link"
                >
                  <CCard>
                    <CCardImage
                      className="card-image"
                      orientation="top"
                      src={voucher.imageUrl}
                    />
                    <CCardBody>
                      <CCardTitle>{voucher.code}</CCardTitle>
                      <CCardText>Price: {voucher.price}</CCardText>
                      <CCardText>Quantity: {voucher.quantity}</CCardText>
                      <CCardText>Expiration Time: {voucher.expTime}</CCardText>
                      <CButton
                        color="danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleDelete(voucher.id);
                        }}
                      >
                        Delete
                      </CButton>
                    </CCardBody>
                  </CCard>
                </Link>
              </CCol>
            ))}
          </CRow>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <CPagination>
              {Array.from({ length: totalPages }, (_, index) => (
                <CPaginationItem
                  key={index}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </CPaginationItem>
              ))}
            </CPagination>
          </div>
        </div>
        <AppFooter />
      </div>
    </div>
  );
};

export default Event;
