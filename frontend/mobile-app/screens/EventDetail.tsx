import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { request } from "../utils/request";
import localhost from "../url.config";
import { useSelector } from "react-redux";
import { useRoute, useNavigation } from "@react-navigation/native";
import { set } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchFavorites } from "../thunks/favoriteThunk";
import { COLORS } from "../constants";
import {  Icon } from "@rneui/themed";

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
  eventID: string; // Bạn có thể giữ hoặc loại bỏ cái này nếu đã có eventId
};

// Type tổng hợp cho dữ liệu API
type ApiResponse = {
  event: event;
  vouchers: voucher[];
};

const DetailScreen = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState("ABOUT"); // Quản lý tab hiện tại
  // const [eventData, setEventData] = useState("");
  // const [vouchers, setVouchers] = useState({});
  const [data, setData] = useState<ApiResponse | null>(null);
  const user = useSelector((state) => state.auth.user);
  const [isFavorite, setIsFavorite] = useState(false); // Trạng thái cho icon trái tim
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [gameData, setGameData] = useState("");
  const favorite = useAppSelector((state) => state.favorite.favorite);

  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;
  // console.log(id);

  // console.log(item);
  // console.log(user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch event detail + voucher
        const response = await fetch(`${localhost}/api/event_command/event_detail/${id}`);
        const data = await response.json();
        setData(data);
        // const favoriteResponse = await fetch(`${localhost}/api/event_query/get_events_user_favorite/${user.id}`);
        // const favoriteData = await favoriteResponse.json();

        // // fetch favorite events
        // let favEvents = [];
        // if(Object.keys(favoriteData).length){
        //   favEvents = favoriteData.map((event: any) => ({
        //     id: event._id,
        //     name: event.name,
        //     description: event.description,
        //     imageUrl: `${localhost}${event.imageUrl}`, // Complete the URL
        //   }));  
        // }
        // else{
        //   // console.log("No fav events!");
        // }



        if (Array.isArray(favorite)) {
          const isEventFavorite = favorite.some(
            (event) => event._id === data.event._id
          );

          setIsFavorite(isEventFavorite);
        } else {
          console.error("Favorite response is not an array:", favorite);
          setIsFavorite(false);
        }
        Image.getSize(localhost + data.event.imageUrl, (width, height) => {
          setImageSize({ width, height });
        });


        // fetch event game
        const gameResponse = await fetch(`${localhost}/api/game/event-game-config/${data.event._id}`);
        const gameData = await gameResponse.json();
        setGameData(gameData);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const toggleFavorite = async () => {
    try {
      setIsFavorite(!isFavorite);
      const favoriteData = {
        userID: user.id,
        eventID: data.event._id,
      };
      const favoriteResponse = await request(
        `/api/event_query/add_events_user_favorite/`,
        "post",
        favoriteData
      );
      dispatch(fetchFavorites({ id: user.id }));
      
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Revert the favorite status locally if the request fails
      setIsFavorite(isFavorite);
    }
  };

  const backToPrevious = () => {
    navigation.goBack();
  };

  const handlePlayGame = () => {
    if (gameData.gameID === 1) {
      navigation.navigate("Quiz", {eventID: data.event._id});
    } else if (gameData.gameID === 2) {
      navigation.navigate("Shake", {eventID: data.event._id});
    }
  }

  const handleReedem = () => {
    navigation.navigate("ExchangeVoucherScreen", {eventID: data.event._id, gameID: gameData.gameID});
  }
  const goBack = () => {
    navigation.goBack();
  }
  // console.log(user);
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={[styles.imageBackgroundContainer]}>
        <ImageBackground source={{uri: localhost + data?.event.imageUrl}} style={styles.imageBackground}>
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
          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>{`${data?.event.startTime.split('T')[0]} - ${data?.event.endTime.split('T')[0]}`}</Text>
          </View>
        </ImageBackground>
      </View>
        <View style={styles.detailsContainer}>
          <View style={styles.headerIcons}>
          <Text style={styles.eventTitle}>{data?.event.name}</Text>
              <TouchableOpacity onPress={toggleFavorite}>
                <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={28} color= {COLORS.accent} style={styles.iconWithBorder} />
              </TouchableOpacity>
            </View>
          <Text style={styles.eventTime}>
            Starting {data?.event.startTime.split("T")[1].split(".")[0]}
          </Text>
          <Text style={styles.eventTime}>
            Endding {data?.event.endTime.split("T")[1].split(".")[0]}
          </Text>
          <View style={styles.tabContainer}>
            <TouchableOpacity onPress={() => handleTabChange("ABOUT")}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === "ABOUT" && styles.activeTab,
                ]}
              >
                ABOUT
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleTabChange("VOUCHERS")}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === "VOUCHERS" && styles.activeTab,
                ]}
              >
                VOUCHERS
              </Text>
            </TouchableOpacity>
          </View>
          {activeTab === "ABOUT" && (
            <>
              <Text style={styles.eventDescription}>
                {data?.event.description}
              </Text>
              <Text style={styles.eventDescription}>
                Game guide: {gameData.guide}
              </Text>
            </>
          )}
          {activeTab === "VOUCHERS" && (
            <View style={styles.voucherContainer}>
              <Text style={styles.voucherTitle}>When join we can receive:</Text>
              {data?.vouchers.map((voucher, index) => (
                <View key={index} style={styles.voucherItem}>
                  {/* <Text style={styles.voucherCode}>{voucher.code}</Text> */}
                  <Text style={styles.voucherDescription}>
                    {voucher.description}
                  </Text>
                  <Text style={styles.voucherDetails}>
                    Discount: {voucher.price}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleReedem}>
          <Text style={styles.buttonText}>Redeem</Text>
          <Ionicons
            name="gift-outline"
            size={20}
            color="white"
            style={styles.buttonIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handlePlayGame}>
          <Text style={styles.buttonText}>Play Game</Text>
          <Ionicons
            name="game-controller-outline"
            size={20}
            color="white"
            style={styles.buttonIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  imageBackgroundContainer: {
    width: "100%",
    height: 300,
    // position: 'relative',
  },
  imageBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
    position: "relative",
  },
  overlay: {
    // ...StyleSheet.absoluteFillObject,
    // backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  header: {
    position: "absolute",
    top: 2,
    left: 2,
    right: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 10,
  },
  iconWithBorder: {
    borderWidth: 2,
    borderColor: COLORS.accent,
    borderRadius: 14, // Cung cấp viền tròn cho các icon
    padding: 5, // Khoảng cách giữa viền và icon
  },
  dateBadge: {
    position: "absolute",
    right: 20,
    bottom: -20,
    backgroundColor: "#6236FF",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  dateText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  detailsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  eventTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
    marginBottom: 5,
  },
  eventTime: {
    fontSize: 14,
    color: "#888",
    marginBottom: 15,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#888",
    marginRight: 20,
  },
  activeTab: {
    color: "black",
    borderBottomColor: "black",
    borderBottomWidth: 2,
  },
  eventDescription: {
    fontSize: 16,
    color: "black",
    marginBottom: 30,
  },
  locationTitle: {
    fontSize: 16,
    color: "black",
    marginBottom: 20,
  },
  voucherContainer: {
    marginTop: 20,
  },
  voucherTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  voucherItem: {
    marginBottom: 15,
  },
  voucherCode: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFCC00",
  },
  voucherDescription: {
    fontSize: 14,
    color: "black",
  },
  voucherDetails: {
    fontSize: 12,
    color: "#888",
  },
  footer: {
    backgroundColor: "#C0C0C0",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    flexDirection: "row", // Đặt hướng flex thành hàng ngang
    justifyContent: "space-between", // Đặt các nút ở hai phía
    alignItems: "center",
    position: "relative",
    bottom: 0,
    width: "100%",
    marginTop: 2,
  },

  button: {
    backgroundColor: "#6236FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonIcon: {
    marginLeft: 10,
  },
});

export default DetailScreen;
