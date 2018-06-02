import React, { Component } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import configureStore from "./configureStore";
import LanguagesList from "./LanguagesList";
import WordTable from "./WordTable";

class App extends Component {
  constructor(props) {
    super(props);
    const { store, persistor } = configureStore();
    this.store = store;
    this.persistor = persistor;
  }

  render() {
    return (
      <Provider store={this.store}>
        <PersistGate loading={null} persistor={this.persistor}>
          <div className="container">
            <div className="row">
              <div className="col-sm-12">
                <LanguagesList />
                <WordTable />
              </div>
            </div>
          </div>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
