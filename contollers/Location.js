const Location = require("../models/Location");
const { cloudinary } = require("../utils/cloudniary");
const Hotel = require("../models/Hotel");
const Menu = require("../models/Menu");
const axios = require("axios");
const API_KEY = "AIzaSyCu1pHsemJ5XMhOE36gG9e77EE1VTb1QUM";
const MAPBOX_API_URL = "https://api.mapbox.com/boundaries/v4/mapbox/places";
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiZGVlcGFrZ29kYXJhIiwiYSI6ImNsbGh0ZWhldDAycjEzcG5xbmZ2Y3NtcTgifQ.YH0ASk4DJRM5kuTK2FCYxQ";
const GOOGLEKEY=process.env.GOOGLE_MAP_API_KEY;
const mapboxUrl = process.env.REACT_APP_MAPBOX_API_URL;
const mapboxAccessToken = process.env.MAPBOX_ACCESS_TOKENS;
const UpdateValue = async (data) => {
  try {
    let arr = [];
    for (let i = 0; i < data.length; i++) {
      arr.push({
        _id: data[i]._id,
        Location: data[i].Location,
        Hotels: data[i].Hotels[0].HotelId
          ? data[i].Hotels[0].HotelId
          : data[i].Hotels[0]._id,
      });
    }
    return arr;
  } catch (err) {
    throw err;
  }
};

const UpdatedHotelList = async (HotelData, FoodItem) => {
  try {
    let NewHotelList = [];
    for (let i = 0; i < HotelData.length; i++) {
      const menu = await Menu.findOne({ Id: HotelData[i]._id });
      if (menu) {
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
  } catch (err) {
    throw err;
  }
};

const UpdatedHotelCategoryList = async (HotelData, Category) => {
  try {
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
  } catch (err) {
    throw err;
  }
};

const DifferentDishes = async (HotelData) => {
  try {
    const MenuItem = new Set();
    const CategoryItem = new Set();
    let HotelList = [];
    HotelList = await Hotel.find(
      { _id: { $in: HotelData } },
      { Name: 1, _id: 1 }
    );

    const MenuItems = await Menu.find({ Id: { $in: HotelData } });
    for (let i = 0; i < MenuItems.length; i++) {
      MenuItems[i].Menu.forEach((menu) => {
        CategoryItem.add(menu.Name);
        menu.items.forEach((item) => {
          MenuItem.add(item.Name);
        });
      });
    }
    return {
      MenuList: Array.from(MenuItem),
      Category: Array.from(CategoryItem),
      HotelList: HotelList,
    };
  } catch (err) {
    throw err;
  }
};

exports.getAllLocation = async (req, res, next) => {
  try {
    const locations = await Location.find();
    res.json({ status: "200", locations: locations });
  } catch (err) {
    res.json({ status: "202", message: "Failed to Get the locations" });
  }
};

exports.getHotelForLocation = async (req, res, next) => {
  try {
    const id = req.params.locationid;
    const location = await Location.findOne({ Location: id })
      .populate("Hotels.HotelId")
      .lean()
      .exec();
    res.json({ status: "200", hotels: location.Hotels });
  } catch (err) {
    res.json({ status: "202", message: "Failed to get hotels for location" });
  }
};

exports.getHotelForLocationName = async (req, res, next) => {
  try {
    const name = req.params.locationname;
    const PageNumber = req.query.PageNumber;
    const PageSize = req.query.PageSize;
    const location = await Location.findOne({ Location: name })
    .populate("Hotels.HotelId")
    .lean()
    .skip(PageSize * PageNumber)
    .limit(PageSize)
    .exec();
    // console.log(Location)
    if(location===null||location.Hotels===null)
    {
      res.json({status:"200",HotelData:[]});
      return ;
    }
    const Hotels = location.Hotels.map((item) => ({
      _id: item.HotelId._id.toString(),
      Name: item.HotelId.Name,
      City: item.HotelId.City,
      Street: item.HotelId.Street,
      Rating: item.HotelId.Rating,
      Category: item.HotelId.Category,
      Id: item.HotelId.Id.toString(),
      Image: item.HotelId.Image,
    }));
    // conosle.log(Hotels)
    res.json({ status: "200", HotelData: Hotels });
  } catch (err) {
    // console.log(err)
    res.json({
      status: "202",
      message: "Failed to get hotels for location name",
    });
  }
};

exports.GetHotelsFromCoordinates = async (lat1, lng1) => {
  try{
  const response = await axios.get(
    `${mapboxUrl}/${lng1},${lat1}?contours_meters=15000&polygons=true&denoise=0.1&access_token=${mapboxAccessToken}`
  );
  if (
    response &&
    response.data &&
    response.data.features &&
    response.data.features.length > 0
  ) {
    const Coordinates = response.data.features[0].geometry.coordinates;
    const locations = await Location.aggregate([
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
    ]).lookup({
      from: "hotels",
      localField: "Hotels.HotelId",
      foreignField: "_id",
      as: "Hotels",
    });
    if (!locations) {
      res.json({ status: "200", HotelData: [] });
      return;
    }
    const locs = await UpdateValue(locations);
    let locas2 = [];
    for (let i = 0; i < locs.length; i++) {
      locas2.push(locs[i].Hotels);
    }
    HotelData = locas2;
  }
  // console.log(HotelData)
  const hotelIds = HotelData.map((item) => item._id);
  return hotelIds;
}
catch(err){
   throw new Error("Error in Locating hotels")
}
};
exports.getLocationForCoordinates = async (req, res, next) => {
 
  try {
    const address = req.params.locationname;
    if (address.split(" ").length === 1) {
      await this.getHotelForLocationName(req, res, next);
      return;
    }
    const Dish = req.query.Dish;
    const Category = req.query.Category;
    const PageNumber = req.query.PageNumber;
    const PageSize = req.query.PageSize;
    const GoogleKey=process.env.GOOGLE_MAP_API_KEY;
    const loca = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${GOOGLEKEY}`
    );
    const { status, results } = loca.data;
    let lat1, lng1;
    if (status === "OK" && results.length > 0) {
      const { lat, lng } = results[0].geometry.location;
      lat1 = lat;
      lng1 = lng;
    } else {
      throw new Error("Could not fetch coordinates");
    }

    const hotelIds = await this.GetHotelsFromCoordinates(lat1, lng1);

    if (Dish) {
      const menus = await Menu.distinct("Id", {
        "Menu.items": {
          $elemMatch: {
            Name: Dish,
          },
        },
      });
      const hotelIdsSet = new Set(hotelIds.map((id) => id.toString()));

      const commonHotelIds = menus.filter((id) =>
        hotelIdsSet.has(id.toString())
      );

      const Hotels = await Hotel.find({ _id: { $in: commonHotelIds } })
        .skip(PageSize * PageNumber)
        .limit(PageSize);
      for (let i = 0; i < Hotels.length; i++) {
        const imageUrl = cloudinary.url(Hotels[i].Image, { format: "jpg" });
        Hotels[i].Image = imageUrl;
      }
      res.json({
        status: "200",
        HotelData: Hotels,
      });
    } else if (Category) {
      const Categorys = await Menu.distinct("Id", { "Menu.Name": Category });
      const hotelIdsSet = new Set(hotelIds.map((id) => id.toString()));

      // Filter common IDs using the Set
      const commonHotelIds = Categorys.filter((id) =>
        hotelIdsSet.has(id.toString())
      );
      const Hotels = await Hotel.find({ _id: { $in: commonHotelIds } });
      res.json({
        status: "200",
        HotelData: Hotels,
      });
    } else {
      if (hotelIds.length > 0) {
        const result = await Hotel.find({ _id: { $in: hotelIds } })
          .skip(PageSize * PageNumber)
          .limit(PageSize);
        res.json({ status: "200", HotelData: result });
      } else {
        res.json({ status: "200", HotelData: HotelIds });
      }
    }
  } catch (err) {
    res.status(404).json({ error: "Could not fetch the data" });
  }
};

exports.getDishes = async (req, res, next) => {
  try {
    let address = req.params.locationname;
    let hotelIds = [];
    if (address.split(" ").length === 1) {
      const location = await Location.findOne(
        { Location: address },
        { "Hotels.HotelId": 1 }
      );

      if (!location) {
        hotelIds = [];
      }

      // Extract HotelIds from the Hotels array
      hotelIds = location.Hotels.map((hotel) => hotel.HotelId);
    } else {
      const loca = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${GOOGLEKEY}`
      );
      const { status, results } = loca.data;
      let lat1, lng1;
      if (status === "OK" && results.length > 0) {
        const { lat, lng } = results[0].geometry.location;
        lat1 = lat;
        lng1 = lng;
      } else {
        throw new Error("Could not fetch coordinates");
      }
      hotelIds = await this.GetHotelsFromCoordinates(lat1, lng1);
    }
    const Data = await DifferentDishes(hotelIds);
    if (Data) {
      res.json({
        status: "200",
        AllData: Data.HotelList,
        MenuItem: Data.MenuList,
        CategoryItem: Data.Category,
      });
    } else {
      res.json({ status: "203", Message: "Cannot load the search Data" });
    }
  } catch (err) {
    res.json({ status: "203", Message: "Error in fetching the dishes" });
  }
};
