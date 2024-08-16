import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, notification } from 'antd'
import { CCardHeader, CPagination, CPaginationItem, CForm, CFormInput, CButton, CAvatar, CCard, CCardBody, CCol, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react'
import './UserManagement.scss'
import CIcon from '@coreui/icons-react'
import { cilPeople, cilOptions } from '@coreui/icons'
import { request } from '../../../hooks/useRequest';
import avatar6 from 'src/assets/images/avatars/6.jpg'
import AddUserModal from './UserManage_AddUser'
import AddCusModal from './UserManage_AddCus'
import AddBrandModal from './UserManage_AddBrand'
import EditUserModal from './UserManage_EditUser'
import { AppSidebar, AppFooter, AppHeader } from '../../../components/index';


import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredUsers, setFilteredUsers] = useState([])
  const [users, setUsers] = useState([]) 
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isModalVisibleBrand, setIsModalVisibleBrand] = useState(false)
  const [isModalVisibleCus, setIsModalVisibleCus] = useState(false)
  const [isModalVisibleEdit, setIsModalVisibleEdit] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [selectedRole, setSelectedRole] = useState('All') 
  const [form] = Form.useForm()
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4); 

  useEffect(() => {
    const fetchUsers = async () => {
      try { 
        const response = await request('api/usermanagement/load', 'get');
        setUsers(response); 
        setFilteredUsers(response); 
      } catch (errors) {
        console.log(errors);
        if (errors.length > 0) {
          toast.error(errors[0].message);
        } else {
          toast.error("An error occurred. Please try again later");
        }
      }
    };
    fetchUsers();
  }, [])

  useEffect(() => {
    filterUsers(searchTerm, selectedRole);
  }, [searchTerm, selectedRole]);

  const filterUsers = (searchTerm, role) => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (role === 'All' || user.role === role)
    );
    setFilteredUsers(filtered);
  }

  const handleSearch = (value) => {
    setSearchTerm(value)
  }

  const handleChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleRoleChange = (role) => {
    setSelectedRole(role)
  }

  const handleAddA = (role) => {
    setIsModalVisible(true)
  }
  const handleAddB = (role) => {
    setIsModalVisibleBrand(true)
  }
  const handleAddU = (role) => {
    setIsModalVisibleCus(true)
  }

  const handleSubmit = (values) => {

  }
  const handleSubmitedit = async (user) => {

  };

  const handleEdit = (user) => {
    setCurrentUser(user)
    setIsModalVisibleEdit(true)
  }

  const handleDelete = async (user) => {
    try {
      const resultdel = await request('api/usermanagement/delete', 'post', { id: user.id, role: user.role });
      toast.success("Delete user successful!");
      // // Xóa user khỏi danh sách users trong state
      // setUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
      // setFilteredUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
    } catch (errors) {
      console.log(errors);
      if (errors.length > 0) {
        toast.error(errors[0].message);
      } else {
        toast.error("An error occurred. Please try again later");
      }
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getPaginatedUsers = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredUsers.slice(startIndex, endIndex);
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
                <CCol xs={4}>
                  <CForm className="search-input-wrapper">
                    <CFormInput
                      type="text"
                      placeholder="Search users/email"
                      value={searchTerm}
                      onChange={handleChange}
                      onKeyPress={(event) => {
                        if (event.key === 'Enter') {
                          handleSearch(searchTerm)
                        }
                      }}
                      className="custom-search-input"
                    />
                  </CForm>
                </CCol>
                <CCol xs={4}>
                  <CDropdown>
                    <CDropdownToggle color="secondary" className="filter-button">
                      {selectedRole === 'All' ? 'All Role' : selectedRole}
                    </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem onClick={() => handleRoleChange('All')}>All</CDropdownItem>
                      <CDropdownItem onClick={() => handleRoleChange('User')}>User</CDropdownItem>
                      <CDropdownItem onClick={() => handleRoleChange('Admin')}>Admin</CDropdownItem>
                      <CDropdownItem onClick={() => handleRoleChange('Brand')}>Brand</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </CCol>
  
                <CCol xs="auto">
                  <CDropdown>
                    <CDropdownToggle color="primary" className="add-button">
                      Add User 
                    </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem onClick={() => handleAddU('User')}>User</CDropdownItem>
                      <CDropdownItem onClick={() => handleAddA('Admin')}>Admin</CDropdownItem>
                      <CDropdownItem onClick={() => handleAddB('Brand')}>Brand</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </CCol>
              </CRow>
  
              <AddUserModal
                isVisible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onSubmit={handleSubmit}
                form={form}
              />
              <AddCusModal
                isVisible={isModalVisibleCus}
                onCancel={() => setIsModalVisibleCus(false)}
                onSubmit={handleSubmit}
                form={form}
              />
              <AddBrandModal
                isVisible={isModalVisibleBrand}
                onCancel={() => setIsModalVisibleBrand(false)}
                onSubmit={handleSubmit}
                form={form}
              />
              <EditUserModal
                isVisible={isModalVisibleEdit}
                onCancel={() => setIsModalVisibleEdit(false)}
                onSubmit={handleSubmitedit}
                currentUser={currentUser}
                form={form}
              />
  
              <CTable align="middle" className="mb-0 border" hover responsive >
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary text-center table-column-icon">
                      
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary table-column-avatar"><CIcon icon={cilPeople} /></CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary table-column-user">User</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center table-column-role">Role</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary table-column-email">Email</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary table-column-phone">Phone</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center table-column-active">Active</CTableHeaderCell>
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
                            <CDropdownItem onClick={() => handleEdit(user)}>Edit</CDropdownItem>
                            <CDropdownItem onClick={() => handleDelete(user)}>Delete</CDropdownItem>
                          </CDropdownMenu>
                        </CDropdown>
                      </CTableDataCell>
                      <CTableDataCell className="text-center table-column-avatar">
                        <CAvatar size="md" src={avatar6} status={user.avatar.status} />
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
                        {user.status  ? 'Active' : 'Inactive'}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>

              <CPagination align="center" className="mt-4">
                <CPaginationItem onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                  Previous
                </CPaginationItem>
                {[...Array(Math.ceil(filteredUsers.length / pageSize)).keys()].map(page => (
                  <CPaginationItem key={page + 1} active={currentPage === page + 1} onClick={() => handlePageChange(page + 1)}>
                    {page + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === Math.ceil(filteredUsers.length / pageSize)}>
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
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition:Bounce
      />
        </div >
    // <>


    // </>
  )
}

export default UserManagement
