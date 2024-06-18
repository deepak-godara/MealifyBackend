const Location = require("../models/Location");
const { cloudinary } = require("../utils/cloudniary");
const Hotel = require("../models/Hotel");
const Menu = require("../models/Menu");
const axios = require("axios");
const API_KEY = "AIzaSyCu1pHsemJ5XMhOE36gG9e77EE1VTb1QUM";
const MAPBOX_API_URL = "https://api.mapbox.com/boundaries/v4/mapbox/places";
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiZGVlcGFrZ29kYXJhIiwiYSI6ImNsbGh0ZWhldDAycjEzcG5xbmZ2Y3NtcTgifQ.YH0ASk4DJRM5kuTK2FCYxQ";
const UpdateValue = async (data) => {
  let arr = [];
  for (let i = 0; i < data.length; i++) {
    arr.push({
      _id: data[i]._id,
      Location: data[i].Location,
      Hotels: data[i].Hotels[0],
    });
  }
  return arr;
};
const UpdatedHotelList = async (HotelData, FoodItem) => {
  let NewHotelList = [];
  for (let i = 0; i < HotelData.length; i++) {
    const menu = await Menu.findOne({ Id: HotelData[i]._id });
    if (!menu) {
      return null;
    } else {
      const foundItem = menu.Menu.reduce((acc, menuSchema) => {
        const item = menuSchema.items.find((item) => {
          return item.Name === FoodItem;
        });
        if (item) {
          return item;
        }
        return acc;
      }, null);
      if (foundItem) {
        NewHotelList.push(HotelData[i]._id.toString());
      }
    }
  }
  return NewHotelList;
};
const UpdatedHotelCategoryList = async (HotelData, Category) => {
  let NewHotelList = [];
  for (let i = 0; i < HotelData.length; i++) {
    const menu = await Menu.findOne({ Id: HotelData[i].Id });
    const foundItem = menu.Menu.find((item) => {
      return item.Name === Category;
    });

    if (foundItem) {
      NewHotelList.push(HotelData[i].Id);
    }
  }
  return NewHotelList;
};
const DifferentDishes = async (HotelData) => {
  const MenuItem = [];
  const CategoryItem = [];
  const HotelList = [];
  for (let i = 0; i < HotelData.length; i++) {
    HotelList.push({ Name: HotelData[i].Name, _id: HotelData[i]._id });
    const MenuItems = await Menu.findOne({
      Id: HotelData[i]._id,
    });
    if (MenuItems) {
      for (let k = 0; k < MenuItems.Menu.length; k++) {
        CategoryItem.push(MenuItems.Menu[k].Name);
        for (let j = 0; j < MenuItems.Menu[k].items.length; j++) {
          MenuItem.push(MenuItems.Menu[k].items[j].Name);
        }
      }
    }
  }
  const NewMenuItem = [...new Set(MenuItem)];
  const NewCategoryItem = [...new Set(CategoryItem)];
  return {
    MenuList: NewMenuItem,
    Category: NewCategoryItem,
    HotelList: HotelList,
  };
};
exports.getAllLocation = (req, res, next) => {
  const loscsdv = "AIzaSyCu1pHsemJ5XMhOE36gG9e77EE1VTb1QUM";
  Location.find()
    .then((location) => {
      res.json({ status: "200", locations: location });
    })
    .catch((err) => {
      res.json({ status: "202", message: "Failed to Get the loctions" });
    });
};
exports.getHotelForLocation = (req, res, next) => {
  const id = req.params.locationid;
  Location.findOne({ Location: id })
    .populate("Hotels.HotelId")
    .lean()
    .exec()
    .then((hotels) => {
      // console.log(hotels.Hotels);
      res.json({ status: "200", hotels: hotels });
    });
};
exports.getHotelForLocationName = (req, res, next) => {
  const name = req.params.locationname;
  console.log(name);
  Location.findOne({ Location: name })
    .populate("Hotels.HotelId")
    .lean()
    .exec()
    .then((hotels) => {
      console.log(hotels);
      const Hotels = hotels.Hotels.map((item) => {
        return {
          _id: item.HotelId._id.toString(),
          Name: item.HotelId.Name,
          City: item.HotelId.City,
          Street: item.HotelId.Street,
          Rating: item.HotelId.Rating,
          Category: item.HotelId.Category,
          Id: item.HotelId.Id.toString(),
          Image: item.HotelId.Image,
        };
      });
      console.log(Hotels);
      res.json({ status: "200", HotelData: Hotels });
    });
};
exports.getLocationForCoordinates = async (req, res, next) => {
  const address = req.params.locationname;
  if (address.split(" ").length == 1) {
    this.getHotelForLocationName(req, res, next);
    return;
  }
  const Dish = req.query.Dish;
  const Category = req.query.Category;
  let HotelDatas = req.body.HotelData;
  let MenuData = req.body.MenuItem;
  let CategoryData = req.body.CategoryItem;
  if (!Dish && !Category) {
    const loca = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${API_KEY}`
    );
    const { status, results } = loca.data;
    let lat1, lng1;
    if (status === "OK" && results.length > 0) {
      const { lat, lng } = results[0].geometry.location;
      lat1 = lat;
      lng1 = lng;
    } else {
    }
    // console.log(lat1 + "  " + lng1);
    await fetch(
      `https://api.mapbox.com/isochrone/v1/mapbox/driving/${lng1}%2C${lat1}?contours_meters=15000&polygons=true&denoise=0.1&access_token=${MAPBOX_ACCESS_TOKEN}`
    )
      .then((responsejs) => {
        return responsejs.json();
      })
      .then((response) => {
        if (response && response.features && response.features.length > 0) {
          const Coordinates = response.features[0].geometry.coordinates;
          return Location.aggregate([
            {
              $unwind: "$Hotels",
            },
            {
              $match: {
                "Hotels.Latitude": { $exists: true },
                "Hotels.Longitude": { $exists: true },
                Hotels: {
                  $geoWithin: {
                    $geometry: {
                      type: "Polygon",
                      coordinates: [Coordinates[0]],
                    },
                  },
                },
              },
            },
          ])
            .lookup({
              from: "hotels",
              localField: "Hotels.HotelId",
              foreignField: "_id",
              as: "Hotels",
            })
            .exec();
        }
      })
      .then((locations) => {
        return UpdateValue(locations);
      })
      .then((locs) => {
        let locas2 = [];
        for (let i = 0; i < locs.length; i++) {
          locas2.push(locs[i].Hotels);
        }
        HotelDatas = locas2;
      })
      .catch((err) => {
        res.status(404).json({ error: "Could not fetch the data" });
        return;
      });
  }
  if (Dish) {
    UpdatedHotelList(HotelDatas, Dish)
      .then((HotelData) => {
        return Hotel.find({ _id: { $in: HotelData } });
      })
      .then((Hotels) => {
        for (let i = 0; i < Hotels.length; i++) {
          const imageUrl = cloudinary.url(Hotels[i].Image, { format: "jpg" });
          Hotels[i].Image = imageUrl;
        }
        res.json({
          status: "200",
          HotelData: Hotels,
          AllData: HotelDatas,
          MenuItem: MenuData,
          CategoryItem: CategoryData,
        });
      })
      .catch((err) => {
        res.json({ status: "203", message: "Error in fetching the hoteldata" });
      });
  } else if (Category) {
    UpdatedHotelCategoryList(HotelDatas, Category)
      .then((HotelData) => {
        return Hotel.find({ _id: { $in: HotelData } });
      })
      .then((Hotels) => {
        // console.log(Hotels)

        res.json({
          status: "200",
          HotelData: Hotels,
          AllData: HotelDatas,
          MenuItem: MenuData,
          CategoryItem: CategoryData,
        });
      })
      .catch((err) => {
        res.json({ status: "203", message: "Error in fwtching the hoteldata" });
      });
  } else {
    if (HotelDatas.length > 0 && !HotelDatas[0].Rating) {
      const hotelIds = HotelDatas.map((item) => item._id);
      Hotel.find({ _id: { $in: hotelIds } }).then((result) => {
        res.json({
          status: "200",
          HotelData: result,
        });
      });
    } else {
      res.json({
        status: "200",
        HotelData: HotelDatas,
      });
    }
  }
};
exports.getDishes = async (req, res, next) => {
  const Hotels = req.body.HotelData;
  const Data = await DifferentDishes(Hotels);
  if (Data) {
    console.log(Data);
    res.json({
      status: "200",
      AllData: Data.HotelList,
      MenuItem: Data.MenuList,
      CategoryItem: Data.Category,
    });
  } else {
    res.json({ status: "203", Message: "Cannot load the search Data" });
  }
};
