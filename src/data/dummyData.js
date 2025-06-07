
export function generateDummyData() {
  const categories = ['Electronics', 'Clothing', 'Food & Beverages', 'Home & Garden', 'Sports', 'Books'];
  const abcClasses = ['A', 'B', 'C'];
  const items = [];

  const itemNames = {
    'Electronics': ['Smartphone', 'Laptop', 'Tablet', 'Headphones', 'Camera', 'Smart Watch', 'Speaker', 'Monitor'],
    'Clothing': ['T-Shirt', 'Jeans', 'Dress', 'Jacket', 'Shoes', 'Hat', 'Sweater', 'Shorts'],
    'Food & Beverages': ['Coffee', 'Tea', 'Snacks', 'Juice', 'Bread', 'Milk', 'Fruits', 'Vegetables'],
    'Home & Garden': ['Chair', 'Table', 'Lamp', 'Plant', 'Cushion', 'Vase', 'Mirror', 'Rug'],
    'Sports': ['Football', 'Basketball', 'Tennis Racket', 'Yoga Mat', 'Dumbbells', 'Running Shoes', 'Bicycle', 'Helmet'],
    'Books': ['Fiction Novel', 'Science Book', 'History Book', 'Biography', 'Cookbook', 'Art Book', 'Travel Guide', 'Dictionary']
  };

  let itemIdCounter = 1;

  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(today.getMonth() - 6);

  categories.forEach(category => {
    itemNames[category].forEach(baseItemName => {
      const specificItemName = `${baseItemName} #${itemIdCounter}`;
      let currentOpeningStock = Math.floor(Math.random() * 500) + 100;
      
      for (let d = new Date(sixMonthsAgo); d <= today; d.setDate(d.getDate() + 1)) {
        const consumption = Math.floor(Math.random() * (currentOpeningStock * 0.15)) + 5; 
        const received = Math.random() < 0.2 ? Math.floor(Math.random() * 100) + 20 : 0; 
        const closingStock = Math.max(0, currentOpeningStock + received - consumption);
        const msl = Math.floor(Math.random() * 80) + 20;
        const abcClass = abcClasses[Math.floor(Math.random() * abcClasses.length)];

        items.push({
          itemId: itemIdCounter,
          itemName: specificItemName,
          category: category,
          abcClass: abcClass,
          date: new Date(d).toISOString().split('T')[0],
          openingStock: currentOpeningStock,
          received: received,
          consumption: consumption,
          closingStock: closingStock,
          msl: msl
        });
        currentOpeningStock = closingStock;
      }
      itemIdCounter++;
    });
  });

  return items;
}
