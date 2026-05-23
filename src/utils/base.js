import pfp from "../assets/images/pfp.png";
import pfp2 from "../assets/images/pfp2.png";
import pfp3 from "../assets/images/pfp3.png";

import pickup from "../assets/icons/pickup.svg";
import parking from "../assets/icons/parking.svg";
import roomserv from "../assets/icons/roomserv.svg";
import internet from "../assets/icons/internet.svg";
import breakfast from "../assets/icons/breakfast.svg";

export const faqItems = [
  {
    question: "Где находится Anor Avenue Hotel?",
    answer:
      "Отель расположен в удобной части города: рядом автобусные остановки, а до станций метро можно дойти пешком.",
  },
  {
    question: "Как забронировать номер?",
    answer:
      "Выберите даты и количество гостей в форме поиска и перейдите к списку доступных номеров. Для подтверждения бронирования можно связаться с отелем через контакты.",
  },
  {
    question: "Есть ли парковка для гостей?",
    answer:
      "Да, для гостей доступна парковка. Перед заездом можно уточнить детали по телефону отеля.",
  },
  {
    question: "Подходит ли отель для семейного отдыха?",
    answer:
      "Да, отель отлично подходит для спокойного семейного отдыха благодаря уютной атмосфере и внимательному сервису.",
  },
  {
    question: "Какие удобства есть в номерах?",
    answer:
      "Номера оснащены всем необходимым для комфортного проживания, чтобы гости чувствовали себя как дома.",
  },
];


export const reviews = [
  {
    name: "Wade Warren",
    company: "Louis Vuitton",
    photo: pfp,
    quote:
      "The team made every detail effortless. The room was peaceful, the service was warm, and the location was perfect for meetings.",
  },
  {
    name: "Albert Florise",
    company: "Nintendo",
    photo: pfp2,
    quote:
      "Excellent stay from start to finish. I appreciated the fast check-in, calm atmosphere, and very attentive support throughout the week.",
  },
  {
    name: "Jenny Wilson",
    company: "Bank of America",
    photo: pfp3,
    quote:
      "A beautiful boutique feel with practical comfort. The hotel strikes the right balance between modern style and genuine hospitality.",
  },
];



export const services = [
  { title: "Pick up & drop", icon: pickup },
  { title: "Parking space", icon: parking },
  { title: "Room service", icon: roomserv },
  { title: "Fiber internet", icon: internet },
  { title: "Breakfast", icon: breakfast },
];

export const stats = [
  { number: "9", label: "Rooms & suites" },
  { number: "25", label: "Restaurant partners" },
  { number: "510+", label: "Satisfied guests" },
  { number: "65", label: "Nearby destinations" },
];