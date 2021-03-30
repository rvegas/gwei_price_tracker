import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from 'react';

import {Line} from 'react-chartjs-2';

import firebase from 'firebase';

import firebaseConfig from './config';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

const pricesRef = firebase.firestore().collection('gwei_prices');

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    pricesRef
    .get()
    .then((snapshot) => {
      const all_prices = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const prices = all_prices.slice(-120);

      const ordered = prices.sort((a,b) => (a.date <= b.date));
      const labels = ordered.map(price => (new Date(price.date.seconds * 1000).toLocaleString('en-GB', { timeZone: 'UTC' })));
      const uni_swap = ordered.map(price => (price.uni_swap));
      const erc_20 = ordered.map(price => (price.erc20_transfer));
      const uni_liq = ordered.map(price => (price.uni_liq));

      setData({
        labels,
        uni_swap,
        erc_20,
        uni_liq
      });
    });
  },[setData]);

  const chart = {
    labels: data ? data.labels : [],
    datasets: [
      {
        label: 'UNI SWAP',
        backgroundColor: 'rgb(20 144 41 / 0.3)',
        borderColor: 'rgb(20 144 41 / 1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 5,
        pointHoverBorderWidth: 2,
        pointRadius: 4,
        pointHitRadius: 10,
        data: data ? data.uni_swap : []
      },
      {
        label: 'ERC 20',
        backgroundColor: 'rgb(27 63 136 / 0.3)',
        borderColor: 'rgb(27 63 136 / 1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 5,
        pointHoverBorderWidth: 2,
        pointRadius: 4,
        pointHitRadius: 10,
        data: data ? data.erc_20 : []
      },
      {
        label: 'UNI LIQ',
        backgroundColor: 'rgb(142 20 144 / .3)',
        borderColor: 'rgb(142 20 144 / 1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 5,
        pointHoverBorderWidth: 2,
        pointRadius: 4,
        pointHitRadius: 10,
        data: data ? data.uni_liq : []
      },
    ]
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Gwei Prices</h2>
        <div className={'chart'}>
          <Line data={chart}/>
        </div>
      </header>
      <footer>
        <a href='https://etherscan.io/apis' target='_blank'>Powered by Etherscan.io APIs</a>
      </footer>
    </div>
  );
}

export default App;
