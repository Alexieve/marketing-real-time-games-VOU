import React, { useState, useEffect } from "react";
import { Form } from "antd";
import {
  CCardHeader,
  CPagination,
  CPaginationItem,
  CForm,
  CFormInput,
  CButton,
  CAvatar,
  CCard,
  CCardBody,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from "@coreui/react";
import "./UserManagement.scss";
import CIcon from "@coreui/icons-react";
import { cilPeople, cilOptions, cilSearch } from "@coreui/icons";
import { request } from "../../hooks/useRequest";
import avatar6 from "src/assets/images/avatars/6.jpg";
import AddUserModal from "./UserManage_CreateAdmin";
import AddCusModal from "./UserManage_CreateCustomer";
import AddBrandModal from "./UserManage_CreateBrand";
import UpdateUserModal from "./UserManage_UpdateUser";
import { AppSidebar, AppFooter, AppHeader } from "../../components/index";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  // const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleBrand, setIsModalVisibleBrand] = useState(false);
  const [isModalVisibleCus, setIsModalVisibleCus] = useState(false);
  const [isModalVisibleEdit, setIsModalVisibleEdit] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("All");
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [totalUsers, setTotalUsers] = useState(0);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const offset = (currentPage - 1) * pageSize;
      const response = await request(
        `api/user-management/load?name=${searchTerm}&role=${selectedRole}&offset=${offset}`,
        "get",
      );
      // setUsers(response);
      setFilteredUsers(response);
      fetchPage();
    } catch (errors) {
      console.log(errors);
      if (errors.length > 0) {
        toast.error(errors[0].message);
      } else {
        toast.error("An error occurred. Please try again later");
      }
    }
  };

  const fetchPage = async () => {
    try {
      const response = await request(
        `api/user-management/countpage?name=${searchTerm}&role=${selectedRole}`,
        "get",
      );
      setTotalUsers(response);
    } catch (errors) {
      console.log(errors);
      if (errors.length > 0) {
        toast.error(errors[0].message);
      } else {
        toast.error("An error occurred. Please try again later");
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, selectedRole]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers();
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };

  const handleAdd = (role) => {
    if (role === "Admin") {
      setIsModalVisible(true);
    } else if (role === "Brand") {
      setIsModalVisibleBrand(true);
    } else if (role === "Customer") {
      setIsModalVisibleCus(true);
    }
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setIsModalVisibleEdit(true);
  };

  const handleDelete = async (user) => {
    try {
      await request(
        `api/user-management/delete/${user.role}/${user.id}`,
        "post",
      );
      toast.success("Delete user successful. Reload after 2 second...");
      setTimeout(() => {
        window.location.reload();
      }, 2000); // Delay một chút để đảm bảo toast hiện ra trước khi reload
    } catch (errors) {
      console.log(errors);
      if (errors.length > 0) {
        toast.error(errors[0].message);
      } else {
        toast.error("An error occurred. Please try again later");
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getPaginatedUsers = () => {
    const tmp = Math.ceil(totalUsers / pageSize);
    if (currentPage !== tmp) {
      return filteredUsers.slice(0, 4);
    }
    const tmp2 = (currentPage - 1) * pageSize;
    const tmp3 = totalUsers - tmp2;
    return filteredUsers.slice(0, tmp3);
  };

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1 m-4">
          <CRow>
            <CCol xs>
              <CCard className="mb-4">
                <CCardHeader>User Management</CCardHeader>
                <CCardBody>
                  <CRow justify="space-between" align="middle" className="mb-4">
                    <CCol xs={3}>
                      <CForm className="search-input-wrapper">
                        <CFormInput
                          type="text"
                          placeholder="Search users/email"
                          value={searchTerm}
                          onChange={handleChange}
                          // onKeyPress={(event) => {
                          //   if (event.key === "Enter") {
                          //     handleSearch();
                          //   }
                          // }}
                          className="custom-search-input"
                        />
                      </CForm>
                    </CCol>
                    <CCol sm={1}>
                      <CButton
                        color="primary"
                        className="ms-2"
                        onClick={() => handleSearch()}
                      >
                        <CIcon icon={cilSearch} />
                      </CButton>
                    </CCol>
                    <CCol xs={3}>
                      <CDropdown>
                        <CDropdownToggle
                          color="secondary"
                          className="filter-button"
                        >
                          {selectedRole === "All" ? "All Role" : selectedRole}
                        </CDropdownToggle>
                        <CDropdownMenu>
                          <CDropdownItem
                            onClick={() => handleRoleChange("All")}
                          >
                            All
                          </CDropdownItem>
                          <CDropdownItem
                            onClick={() => handleRoleChange("Admin")}
                          >
                            Admin
                          </CDropdownItem>
                          <CDropdownItem
                            onClick={() => handleRoleChange("Brand")}
                          >
                            Brand
                          </CDropdownItem>
                          <CDropdownItem
                            onClick={() => handleRoleChange("Customer")}
                          >
                            Customer
                          </CDropdownItem>
                        </CDropdownMenu>
                      </CDropdown>
                    </CCol>

                    <CCol xs="auto">
                      <CDropdown>
                        <CDropdownToggle color="primary" className="add-button">
                          Add User
                        </CDropdownToggle>
                        <CDropdownMenu>
                          <CDropdownItem onClick={() => handleAdd("Admin")}>
                            Admin
                          </CDropdownItem>
                          <CDropdownItem onClick={() => handleAdd("Brand")}>
                            Brand
                          </CDropdownItem>
                          <CDropdownItem onClick={() => handleAdd("Customer")}>
                            Customer
                          </CDropdownItem>
                        </CDropdownMenu>
                      </CDropdown>
                    </CCol>
                  </CRow>

                  <AddUserModal
                    isVisible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    form={form}
                    setSelectedRole={setSelectedRole}
                    setSearchTerm={setSearchTerm}
                  />
                  <AddCusModal
                    isVisible={isModalVisibleCus}
                    onCancel={() => setIsModalVisibleCus(false)}
                    form={form}
                    setSelectedRole={setSelectedRole}
                    setSearchTerm={setSearchTerm}
                  />
                  <AddBrandModal
                    isVisible={isModalVisibleBrand}
                    onCancel={() => setIsModalVisibleBrand(false)}
                    form={form}
                    setSelectedRole={setSelectedRole}
                    setSearchTerm={setSearchTerm}
                  />
                  <UpdateUserModal
                    isVisible={isModalVisibleEdit}
                    onCancel={() => setIsModalVisibleEdit(false)}
                    currentUser={currentUser}
                    form={form}
                    setSelectedRole={setSelectedRole}
                    setSearchTerm={setSearchTerm}
                  />

                  <CTable
                    align="middle"
                    className="mb-0 border"
                    hover
                    responsive
                  >
                    <CTableHead className="text-nowrap">
                      <CTableRow>
                        <CTableHeaderCell className="bg-body-tertiary text-center table-column-icon"></CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary table-column-avatar">
                          <CIcon icon={cilPeople} />
                        </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary table-column-user">
                          User
                        </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary text-center table-column-role">
                          Role
                        </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary table-column-email">
                          Email
                        </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary table-column-phone">
                          Phone
                        </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary text-center table-column-active">
                          Active
                        </CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {getPaginatedUsers().map((user, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell className="text-center table-column-icon">
                            <CDropdown>
                              <CDropdownToggle className="text-primary custom-dropdown-button no-arrow">
                                <CIcon icon={cilOptions} />
                              </CDropdownToggle>
                              <CDropdownMenu>
                                <CDropdownItem onClick={() => handleEdit(user)}>
                                  Edit
                                </CDropdownItem>
                                <CDropdownItem
                                  onClick={() => handleDelete(user)}
                                >
                                  Delete
                                </CDropdownItem>
                              </CDropdownMenu>
                            </CDropdown>
                          </CTableDataCell>
                          <CTableDataCell className="text-center table-column-avatar">
                            <CAvatar
                              size="md"
                              src={avatar6}
                              status={user.avatar.status}
                            />
                          </CTableDataCell>
                          <CTableDataCell className="table-column-user">
                            <div>{user.name}</div>
                            {/* <div className="small text-body-secondary text-nowrap">
                          <span>{user.new ? 'New' : 'Recurring'}</span> | Registered: {user.registered}
                        </div> */}
                          </CTableDataCell>
                          <CTableDataCell className="text-center table-column-role">
                            {user.role}
                          </CTableDataCell>
                          <CTableDataCell className="table-column-email">
                            {user.email}
                          </CTableDataCell>
                          <CTableDataCell className="text-center table-column-phone">
                            {user.phonenum}
                          </CTableDataCell>
                          <CTableDataCell className="text-center table-column-active">
                            {user.status ? "Active" : "Inactive"}
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>

                  <CPagination align="center" className="mt-4">
                    <CPaginationItem
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </CPaginationItem>
                    {[...Array(Math.ceil(totalUsers / pageSize)).keys()].map(
                      (page) => (
                        <CPaginationItem
                          key={page + 1}
                          active={currentPage === page + 1}
                          onClick={() => handlePageChange(page + 1)}
                        >
                          {page + 1}
                        </CPaginationItem>
                      ),
                    )}
                    <CPaginationItem
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={
                        currentPage === Math.ceil(totalUsers / pageSize)
                      }
                    >
                      Next
                    </CPaginationItem>
                  </CPagination>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </div>
        <AppFooter />
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="colored"
        transition:Slide
      />
    </div>
  );
};

export default UserManagement;
