// data/testData.js
const users = new Map();
const cart = new Map();
const orders = new Map();
let orderIdCounter = 1;

const categories = [
  { id: 1, name: "DI STOP" },
  { id: 2, name: "Вода Эмульсионные Краски" },
  { id: 3, name: "Гидроизоляция" },
  { id: 4, name: "Грунтовки и добавки" },
  { id: 5, name: "Заполнитель швов" },
  { id: 6, name: "Клеи" },
  { id: 7, name: "Наливной пол" },
  { id: 8, name: "Шпатлевки" },
  { id: 9, name: "Штукатурки" },
];

const products = [
  {
    id: 1,
    name: "DI STOP 10KG",
    categoryId: 1,
    price: 23000,
    bonus: 1,
    hasBonus: true,
  },
  {
    id: 2,
    name: "DI STOP 10KG 4-COMPONENT (32)",
    categoryId: 1,
    price: 25000,
    bonus: 1,
    hasBonus: true,
  },
  {
    id: 3,
    name: "DI STOP 20KG",
    categoryId: 1,
    price: 45000,
    bonus: 2,
    hasBonus: true,
  },
  {
    id: 4,
    name: "DI STOP 20KG 8-COMPONENT (32)",
    categoryId: 1,
    price: 48000,
    bonus: 2,
    hasBonus: true,
  },
  {
    id: 5,
    name: "DI STOP 4,5LITR SUYUQLIGI",
    categoryId: 1,
    price: 32000,
    bonus: 0,
    hasBonus: false,
  },
  {
    id: 6,
    name: "DI STOP 8LITR SUYUQLIGI",
    categoryId: 1,
    price: 58000,
    bonus: 0,
    hasBonus: false,
  },
  {
    id: 7,
    name: "EXPRESS DI STOP 20KG",
    categoryId: 1,
    price: 52000,
    bonus: 2,
    hasBonus: true,
  },
  {
    id: 8,
    name: "EXPRESS DI STOP-2-KOMPONENT",
    categoryId: 1,
    price: 38000,
    bonus: 1,
    hasBonus: true,
  },
  {
    id: 9,
    name: "EXPRESS DI STOP LITR SUYUQLIGI",
    categoryId: 1,
    price: 35000,
    bonus: 0,
    hasBonus: false,
  },
  {
    id: 10,
    name: "MONO STOP 25KG",
    categoryId: 1,
    price: 48000,
    bonus: 0,
    hasBonus: false,
  },
];

const userStates = new Map();

function initTestData() {
  console.log("✅ Тестовые данные загружены");
}

function getNextOrderId() {
  return orderIdCounter++;
}

module.exports = {
  users,
  cart,
  orders,
  categories,
  products,
  userStates,
  initTestData,
  getNextOrderId,
};
