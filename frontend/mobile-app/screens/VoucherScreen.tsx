

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { request } from '../utils/request';
import { useNavigation } from '@react-navigation/native';

import localhost from '../url.config';
import { useSelector } from 'react-redux';



const VoucherScreen = () => {
  const [data, setData] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${localhost}/api/event_query/get_user_vouchers/${user.id}`);
        const data = await response.json();
        // const favoriteResponse = await fetch(`${localhost}/api/event_query/get_events_user_favorite/${user.id}`);
        // const favoriteData = await favoriteResponse.json();

        // const response = await request(`/api/event_query/get_user_vouchers/${user.id}`, 'get', "a");
        setData(data);



      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  console.log(data)
  const handleDetailPress = (eventId: string) => {
    navigation.navigate('VoucherDetail', { eventId });
  };

  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No Voucher for you!!</Text>
      </View>
    );
  }
  const formatDate = (dateString: string) => {
    const [datePart, timePart] = dateString.split('T'); // Tách phần ngày và thời gian
    const time = timePart.split('.')[0]; // Bỏ phần giây thập phân (phần sau dấu '.')

    // Tách phần năm-tháng-ngày
    const [year, month, day] = datePart.split('-');

    // Tách phần giờ-phút-giây
    const [hour, minute, second] = time.split(':');

    // Trả về chuỗi định dạng: "DD/MM/YYYY HH:MM:SS"
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  };
  console.log(data);
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {data.map((voucher: any, index: any) => (
        <View key={index} style={styles.cardContainer}>
          <View style={styles.leftContainer}>
            <Image source={{ uri: localhost + voucher.imageUrl }} style={styles.brandImage} />
            {/* <Text style={styles.brandName}>{voucher.brand}</Text> */}
          </View>

          <View style={styles.rightContainer}>
            <Text style={styles.discountText}>Discount: {voucher.price}đ  x{voucher.quantity}</Text>
            <Text style={styles.descriptionText}>{voucher.description}</Text>
            <Text style={styles.expiryText}>HSD: {formatDate(voucher.expTime)}</Text>
            <View style={styles.detailButtonWrapper}>
              <TouchableOpacity style={styles.detailButton} onPress={() => handleDetailPress(voucher.voucherID)}>
                <Text style={styles.detailButtonText}>Detail</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  detailButtonWrapper: {
    width: '100%', // Ensure the button takes up the full width if needed
  },
  scrollContainer: {
    paddingVertical: 10,
  },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,            // Độ dày của khung
    borderColor: '#3498db',    // Màu của khung
    borderRadius: 8,           // Góc bo tròn của khung
    padding: 5,                // Khoảng cách giữa nội dung và khung
    backgroundColor: '#f5f5f5' // Màu nền của khung
  },
  rightContainer: {
    flex: 3,
    alignItems: 'flex-start',
    marginLeft: 20,            // Khoảng cách bên ngoài khung (có thể thay đổi giá trị)
    position: 'relative',      // Để có thể căn chỉnh tuyệt đối các phần tử con
  },
  discountText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  expiryText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  },
  brandImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  brandName: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  detailButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#3498db',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10, // Optional: Add margin-top if needed to separate the button from the expiry date

  },
  detailButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
  },
});

export default VoucherScreen;
