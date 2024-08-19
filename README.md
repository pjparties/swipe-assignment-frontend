# Swipe Assignment

## Overview
The project is a fork of the Swipe Assignment Frontend project. I have added new features on top of the existing codebase while keeping consistency with the given codebase practices.

Please note that I have not changed the existing codebase, only added new features. This means that certain design decisions may not be optimal, but I have tried to keep the codebase consistent with the existing codebase.

## Features
This repo extends the parent repo by adding the following features:
- A new tab for managing products.
- The ability to add, edit, and delete products via Products
- The ability to convert currencies using exchange rates fetched from an API.
- The ability to change the currency used for the invoice.
- The ability to update the invoice items based on the selected currency.
- The ability to update the product prices based on the selected currency.

## How-to
> [!TIP]
> **To add Products**
> Click on the "Add Item" button to add a new item. Set Name, Quantity, and Price for the item.
> The product will automatically be added to the invoice table as well as the storage for products. ie. Products tab.

> [!TIP]
> **To Edit Products**
> Products can be updated via both the Products tab and the Invoice tab.

> [!IMPORTANT]
> The currency can be changed using the currency dropdown in the header. The items will be updated based on the selected currency.

> [!WARNING]
> Deleting or updating an item will remove it from the invoice table as well as the storage for products. ie. Products tab.

> [!NOTE]
> The default currency is set to INR, and the items are updated based on their INR price. The currency can be changed using the currency dropdown in the header.

## Key Features

- Renders a table of invoice items if there are any items.
- Provides an "Add Item" button to add new items.
- allows editing and deleting of items.
- Displays the total amount of the invoice based on the items.
- Different currencies can be used for the invoice generation.
- By default, the currency is set to INR, and the items are updated based on their INR price.

## Dependencies
- React
- Redux Toolkit
- react-bootstrap
- react-icons

## Styling

Styling is done using Bootstrap and custom CSS in `App.css`. I have tried to keep the styling consistent with the existing codebase. Although, my focus was on functionality rather than styling. I would prefer to use a modular CSS or tailwind CSS approach if given the freedom to do so.
