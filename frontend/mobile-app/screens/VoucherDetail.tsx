import React, { useState, useEffect } from 'react';
import { View,Image, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { request } from '../utils/request';
import localhost from '../url.config';
import { useSelector } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';

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
        const response = await request(`/api/event_command/voucher_detail/${eventId}`, 'get', "a");
        setData(response);
        const response2 = await request(`/api/event_command/event_detail/${response.eventID}`, 'get', "a");
        setData2(response2);
        console.log(response2);
        Image.getSize(localhost + response2.event.imageUrl, (width, height) => {
          setImageSize({ width, height });
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [eventId]);

  const voucher = {
    discount: 'VietQR hoàn 5K',
    image: require('../assets/test.png'),
    description: 'cho mọi giao dịch quét VietQR/QR Ngân hàng',
    expiry: '12/09/2024',
    imageBrand2: require('../assets/test.png'),
    brand: 'VietQR/QR Ngân Hàng',
    code: 'ABC123', // Mã code của voucher
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };
  // console.log(data);
  // console.log(data2);
  console.log(imageSize);
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={[styles.imageBackgroundContainer, { aspectRatio: imageSize.width / imageSize.height }]}>
          <ImageBackground source={{uri: localhost + data2?.event.imageUrl}} style={styles.imageBackground}>
            <View style={styles.header}>
              <TouchableOpacity  onPress={() => navigation.navigate('VoucherScreen')}>
                <Ionicons name="chevron-back" size={28} color="black" style={styles.iconWithBorder} />
              </TouchableOpacity>
            </View>
            <View style={styles.overlay} />
          </ImageBackground>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Discount: {data.price}</Text>
            <Text style={styles.cardDescription}>{data.description}</Text>
            <Text style={styles.cardExpiry}>HSD: {formatDate(data.expTime)}</Text>
            {/* <Text style={styles.cardBrand}>Event: {data2?.event.name}</Text> */}
          </View>
        </View>
        <View style={styles.detailsContainer}>
        <View style={styles.codeCard}>
            <Text style={styles.qrTitle}>QR code</Text> {/* Thêm title */}
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
    height: undefined,
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
    top: 20,
    left: 20,
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
