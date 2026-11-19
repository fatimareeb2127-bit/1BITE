import foodModel from "../models/foodModel.js";
import fs from 'fs'
import mongoose from "mongoose";

const fallbackFoodList = () => {
    const catalog = [
        { name: "Greek Salad", category: "Salad", price: 12, description: "Crisp greens and fresh vegetables come together in a bright, refreshing salad." },
        { name: "Veg Salad", category: "Salad", price: 18, description: "A colorful mix of garden vegetables makes this a fresh, satisfying choice." },
        { name: "Clover Salad", category: "Salad", price: 16, description: "A light, crunchy salad layered with fresh greens and seasonal vegetables." },
        { name: "Chicken Salad", category: "Salad", price: 24, description: "Tender chicken meets crisp greens for a hearty take on a fresh salad." },
        { name: "Lasagna Rolls", category: "Rolls", price: 14, description: "Savory lasagna-inspired filling rolled into a warm, easy-to-enjoy bite." },
        { name: "Peri Peri Rolls", category: "Rolls", price: 12, description: "A warmly spiced peri-peri filling wrapped up for a bold, savory snack." },
        { name: "Chicken Rolls", category: "Rolls", price: 20, description: "A satisfying chicken filling tucked into a soft roll for a quick meal." },
        { name: "Veg Rolls", category: "Rolls", price: 15, description: "A savory blend of vegetables wrapped into a convenient, flavor-packed roll." },
        { name: "Ripple Ice Cream", category: "Dessert", price: 14, description: "Smooth, chilled ice cream swirled with a sweet ripple throughout." },
        { name: "Fruit Ice Cream", category: "Dessert", price: 22, description: "Creamy ice cream paired with fruity sweetness for a refreshing dessert." },
        { name: "Jar Ice Cream", category: "Dessert", price: 10, description: "A cool, creamy ice-cream treat served in a handy individual jar." },
        { name: "Vanilla Ice Cream", category: "Dessert", price: 12, description: "Classic vanilla ice cream with a smooth, mellow sweetness." },
        { name: "Chicken Sandwich", category: "Sandwich", price: 12, description: "Seasoned chicken layered in bread for a familiar, filling sandwich." },
        { name: "Vegan Sandwich", category: "Sandwich", price: 18, description: "A plant-based sandwich with a savory vegetable filling." },
        { name: "Grilled Sandwich", category: "Sandwich", price: 16, description: "A warm grilled sandwich with crisp toasted bread and a savory center." },
        { name: "Bread Sandwich", category: "Sandwich", price: 24, description: "A simple, comforting sandwich layered between slices of soft bread." },
        { name: "Cup Cake", category: "Cake", price: 14, description: "A soft individual cake portion for a sweet little treat." },
        { name: "Vegan Cake", category: "Cake", price: 12, description: "A tender plant-based cake made for a sweet, dairy-free bite." },
        { name: "Butterscotch Cake", category: "Cake", price: 20, description: "A soft cake with rich butterscotch sweetness in every slice." },
        { name: "Sliced Cake", category: "Cake", price: 15, description: "A generous slice of soft cake, ready to enjoy with a cup of tea." },
        { name: "Garlic Mushroom", category: "Pure Veg", price: 14, description: "Savory mushrooms with aromatic garlic make a rich vegetarian side." },
        { name: "Fried Cauliflower", category: "Pure Veg", price: 22, description: "Cauliflower cooked until golden for a crisp, satisfying vegetable dish." },
        { name: "Mix Veg Pulao", category: "Pure Veg", price: 10, description: "Fragrant rice cooked with a colorful mix of vegetables." },
        { name: "Rice Zucchini", category: "Pure Veg", price: 12, description: "A comforting rice dish paired with tender zucchini." },
        { name: "Cheese Pasta", category: "Pasta", price: 12, description: "Pasta coated in a creamy, savory cheese sauce." },
        { name: "Tomato Pasta", category: "Pasta", price: 18, description: "Pasta tossed with a bright tomato-based sauce." },
        { name: "Creamy Pasta", category: "Pasta", price: 16, description: "A smooth, creamy pasta dish made for a comforting meal." },
        { name: "Chicken Pasta", category: "Pasta", price: 24, description: "Tender chicken and pasta make a hearty, satisfying combination." },
        { name: "Butter Noodles", category: "Noodles", price: 14, description: "Warm noodles tossed with buttery flavor for a simple comfort dish." },
        { name: "Veg Noodles", category: "Noodles", price: 12, description: "Noodles stir-tossed with vegetables for a savory, colorful meal." },
        { name: "Somen Noodles", category: "Noodles", price: 20, description: "Delicate somen noodles served as a light, satisfying noodle dish." },
        { name: "Cooked Noodles", category: "Noodles", price: 15, description: "A comforting serving of noodles prepared for an easy, savory meal." },
    ]
    return fs.readdirSync("uploads")
        .filter((filename) => /food_(\d+)\.(png|jpg|jpeg|webp)$/i.test(filename))
        .sort((a, b) => Number(a.match(/food_(\d+)/)?.[1] || 0) - Number(b.match(/food_(\d+)/)?.[1] || 0))
        .map((filename) => {
            const number = Number(filename.match(/food_(\d+)/)?.[1] || 0)
            const dish = catalog[number - 1]
            if (!dish) return null
            return {
                _id: `fallback-${number}`,
                ...dish,
                image: filename
            }
        })
        .filter(Boolean)
}

// add food items 
const addFood = async (req, res) =>{

    let image_filename = `${req.file.filename}`

    const food = new foodModel({
        name : req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    })
    try{
        await food.save()
        res.json({success:true,message:"Food Added"})
    }catch(error){
        console.log(error)
        res.json({success:false,message:"Error"})
    }

}

// List of All Food
const listfood = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json({success: true, data: fallbackFoodList()})
        }
        const foods = await foodModel.find({});
        if (foods.length > 0) {
            return res.json({success: true, data: foods})
        }

        res.json({success: true, data: fallbackFoodList()})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: "Error"})
    }
}

// Remove food items
const removeFood = async (req, res)=>{
    try {
        const food =await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{})

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success: true, message: "food Removed"})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: "Error"})
    }
}

export {addFood, listfood, removeFood}