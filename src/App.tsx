import { Icon } from './components/Icon';
import { Penguin } from './components/Penguin';
import { PhoneFrame } from './components/PhoneFrame';

export function App() {
  return (
    <PhoneFrame>
      <main className="app-placeholder">
        <Penguin pose="ready" pixelSize={5} />
        <h1 className="title">Mission: Impenguinable</h1>
        <div className="app-placeholder-icons">
          <Icon name="fish" size={36} />
          <Icon name="paw" size={36} />
          <Icon name="igloo" size={36} />
          <Icon name="flag" size={36} />
        </div>
      </main>
    </PhoneFrame>
  );
}
