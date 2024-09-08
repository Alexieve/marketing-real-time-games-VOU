import React, { useState, useEffect } from 'react';
import { View,Image, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import {  Icon } from "@rneui/themed";

import { Ionicons } from '@expo/vector-icons';
import { request } from '../utils/request';
import localhost from '../url.config';
import { useSelector } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';
import { COLORS } from "../constants";

type game = {
  gameID: string;
  playTurn: number;
};

type event = {
  _id: string;
  name: string;
  imageUrl: string;
  description: string;
  startTime: string;
  endTime: string;
  brand: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  game: game;
};

type voucher = {
  _id: string;
  code: string;
  qrCodeUrl: string;
  imageUrl: string;
  price: number;
  description: string;
  quantity: number;
  expTime: string;
  status: string;
  brand: string;
  eventId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  eventID: string;  // Bạn có thể giữ hoặc loại bỏ cái này nếu đã có eventId
};

// Type tổng hợp cho dữ liệu API
type ApiResponse = {
  event: event;
  vouchers: voucher[];
};
const VoucherDetail = () => {
  const [data, setData] = useState({});
  const [data2, setData2] = useState<ApiResponse | null>(null);
  const user = useSelector((state) => state.auth.user);
  const route = useRoute();
  const navigation = useNavigation();
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const { eventId } = route.params;
  console.log(eventId);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await request(`/api/event_command/voucher_detail/${eventId}`, 'get', "a");
        let response = await fetch(`${localhost}/api/event_command/voucher_detail/${eventId}`);
        let responseJson = await response.json();
        setData(responseJson);
        // const response = await request(`/api/event_command/event_detail/${response.eventID}`, 'get', "a");
        response = await fetch(`${localhost}/api/event_command/event_detail/${responseJson.eventID}`);
        responseJson = await response.json();
        setData2(responseJson);
        // console.log(response2);
        Image.getSize(localhost + responseJson.event.imageUrl, (width, height) => {
          setImageSize({ width, height });
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [eventId]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A'; // Trả về 'N/A' nếu chuỗi không tồn tại
    const [datePart, timePart] = dateString.split('T'); // Tách phần ngày và thời gian
    const time = timePart.split('.')[0]; // Bỏ phần giây thập phân (phần sau dấu '.')
    
    // Tách phần năm-tháng-ngày
    const [year, month, day] = datePart.split('-');
    
    // Tách phần giờ-phút-giây
    const [hour, minute, second] = time.split(':');
  
    // Trả về chuỗi định dạng: "DD/MM/YYYY HH:MM:SS"
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  };
  // console.log(data);
  // console.log(data2);
  // console.log(imageSize);
  const goBack = () => {
    navigation.goBack();
  }
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={[styles.imageBackgroundContainer]}>
          <ImageBackground source={{uri: localhost + data2?.event.imageUrl}} style={styles.imageBackground}>
            <View style={styles.header}>
            <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 20,
          width: "100%",
          // backgroundColor: "#f5f5f5",
          paddingLeft: 20,
          paddingRight: 20,
          // paddingBottom: 10,
          borderRadius: 5,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.accent,
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={goBack}
        >
          <Icon name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
            </View>
            <View style={styles.overlay} />
          </ImageBackground>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Discount: {data.price}đ</Text>
            <Text style={styles.cardDescription}>{data.description}</Text>
            <Text style={styles.cardExpiry}>EXP: {formatDate(data.expTime)}</Text>
            {/* <Text style={styles.cardBrand}>Event: {data2?.event.name}</Text> */}
          </View>
        </View>
        <View style={styles.detailsContainer}>
        <View style={styles.codeCard}>
            <Text style={styles.qrTitle}>QR code</Text>
            <Image source={{uri: localhost + data.imageUrl}} style={styles.codeImage} />
            <Text style={styles.codeTitle}>Code: {data.code}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  imageBackgroundContainer: {
    width: '100%',
    height: 300,
    // position: 'relative',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  overlay: {
    // ...StyleSheet.absoluteFillObject,
    // backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  header: {
    position: 'absolute',
    top: 2,
    left: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconWithBorder: {
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 14,
    padding: 5,
  },
  card: {
    backgroundColor: '#FFFAFA',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    position: 'absolute',
    bottom: -60, // Điều chỉnh để thẻ nằm phần dưới của hình ảnh
    width: '90%', // Đảm bảo thẻ không quá rộng
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 16,
    color: 'black',
    marginBottom: 10,
  },
  cardExpiry: {
    fontSize: 16,
    color: 'black',
    marginBottom: 10,
  },
  cardBrand: {
    fontSize: 16,
    color: 'black',
  },
  detailsContainer: {
    flex: 3,
    paddingHorizontal: 20,
    paddingTop: 100, // Điều chỉnh để tránh chồng lên thẻ trên
  },
  codeCard: {
    backgroundColor: '#FFFAFA',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  codeImage: {
    width: 300,
    height: 300,
    marginBottom: 10,
  },
  codeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  qrTitle: { // Style cho title "Ảnh QR"
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
});

export default VoucherDetail;
