"use server"

import nodemailer from 'nodemailer'
import { EmailContent, EmailProductInfo, NotificationType } from '@/types';

const Notification = {
  WELCOME: 'WELCOME',
  CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
  LOWEST_PRICE: 'LOWEST_PRICE',
  THRESHOLD_MET: 'THRESHOLD_MET',
}

export async function generateEmailBody(
    product: EmailProductInfo,
    type: NotificationType
  ) {
    const THRESHOLD_PERCENTAGE = 40;
    const shortenedTitle =
      product.title.length > 20
        ? `${product.title.substring(0, 20)}...`
        : product.title;
  
    let subject = "";
    let body = "";
  
    switch (type) {
      case Notification.WELCOME:
        subject = `Welcome to Price Tracking for ${shortenedTitle}`;
        body = `
          <div style="background-color: #f8f8f8; border: 1px solid #ccc; padding: 10px;">
            <h2 style="color: #333;">Welcome to DealDasher 🚀</h2>
            <p>You are now tracking <strong>${shortenedTitle}</strong>.</p>
            <p>Here's an example of how you'll receive updates:</p>
            <div style="border: 1px solid #ccc; padding: 10px; background-color: #fff; border-radius: 5px;">
              <h3>${product.title} is back in stock!</h3>
              <p>We're excited to let you know that <strong>${shortenedTitle}</strong> is now back in stock.</p>
              <p>Don't miss out - <a href="${product.url}" style="color: #007BFF; text-decoration: none;" target="_blank" rel="noopener noreferrer">Buy it now</a>!</p>
              <img src="https://img.freepik.com/free-vector/skull-gaming-with-joy-stick-emblem-modern-style_32991-492.jpg?w=900&t=st=1698510738~exp=1698511338~hmac=f7b78295128adbe124d118e107839a9e1cbebe317e1dc9a01c691f51a2a74717" alt="Image Alt Text" width="300" height="200">
              </div>
            <p>Stay tuned for more updates on <strong>${shortenedTitle}</strong> and other products you're tracking.</p>
          </div>
        `;
        break;
  
      case Notification.CHANGE_OF_STOCK:
        subject = `${shortenedTitle} is now back in stock!`;
        body = `
          <div>
            <h2 style="color: #333;">Great News!</h2>
            <p><strong>${shortenedTitle}</strong> is now back in stock. Hurry and grab yours before they run out again!</p>
            <p>See the product <a href="${product.url}" style="color: #007BFF; text-decoration: none;" target="_blank" rel="noopener noreferrer">here</a>.</p>
          </div>
        `;
        break;
  
      case Notification.LOWEST_PRICE:
        subject = `Lowest Price Alert for ${shortenedTitle}`;
        body = `
          <div>
            <h2 style="color: #333;">Don't Miss This Deal!</h2>
            <p><strong>${shortenedTitle}</strong> has reached its lowest price ever. Grab the product <a href="${product.url}" style="color: #007BFF; text-decoration: none;" target="_blank" rel="noopener noreferrer">here</a> now.</p>
          </div>
        `;
        break;
  
      case Notification.THRESHOLD_MET:
        subject = `Discount Alert for ${shortenedTitle}`;
        body = `
          <div>
            <h2 style="color: #333;">Exclusive Discount!</h2>
            <p><strong>${shortenedTitle}</strong> is now available at a discount of more than ${THRESHOLD_PERCENTAGE}%. Don't miss out, grab it right away from <a href="${product.url}" style="color: #007BFF; text-decoration: none;" target="_blank" rel="noopener noreferrer">here</a>.</p>
          </div>
        `;
        break;
  
      default:
        throw new Error("Invalid notification type.");
    }
  
    return { subject, body };
  }  

const transporter = nodemailer.createTransport({
  pool: true,
  service: 'hotmail',
  port: 2525,
  auth: {
    user: 'lakshaykhattar02@outlook.com',
    pass: process.env.EMAIL_PASSWORD,
  },
  maxConnections: 1
})

export const sendEmail = async (emailContent: EmailContent, sendTo: string[]) => {
  const mailOptions = {
    from: 'lakshaykhattar02@outlook.com',
    to: sendTo,
    html: emailContent.body,
    subject: emailContent.subject,
  }

  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if(error) return console.log(error);
    
    console.log('Email sent: ', info);
  })
}