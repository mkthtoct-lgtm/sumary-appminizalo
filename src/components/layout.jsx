import { getSystemInfo } from "zmp-sdk";
import {
  AnimationRoutes,
  App,
  Route,
  SnackbarProvider,
  ZMPRouter,
} from "zmp-ui";


// 1. Import các trang khảo sát 
import HomePage from "../pages/index";
import Quiz1Page from "../pages/quiz1";
import Quiz2Page from "../pages/quiz2";
import Quiz2_1Page from "../pages/quiz2_1";
import Quiz2_2Page from "../pages/quiz2_2";
import Quiz2_3Page from "../pages/quiz2_3";
import ThanksPage from "../pages/thanks";
import MorePage from "../pages/more";



// 2. Import các trang hitogame 
import HomePageAdventure from "../pages/index-hito-adventure";
import UserInfoPage from "../pages/user-info";
import GamePage from "../pages/game"; // Thêm dòng này
import ResultPage from "../pages/result"; // Thêm dòng này
import LuckySpinPage from "../pages/lucky-spin";

// 3. Import trang hitocareer
import HomePagecareer from "../pages/index-career";

// 4. Import trang English
import HomePageEnglish from "../pages/index-english";

// 5. Import trang Visa Test
import VisaTestPage from "../pages/VisaTest";
import { VisaTestProvider } from "../context/VisaTestContext";

const Layout = () => {
  return (
    <App theme={getSystemInfo().zaloTheme}>
      <SnackbarProvider>
        <ZMPRouter>
          <AnimationRoutes>
            {/* Trang chủ Chính khảo sát */}
            <Route path="/" element={<HomePage />}></Route>
            {/* Trang của khảo sát Quiz1 info-users */}
            <Route path="/quiz1" element={<Quiz1Page />}> </Route>
            {/* Trang của khảo sát Quiz2 */}
            <Route path="/quiz2" element={<Quiz2Page />}> </Route>
            { /* Trang của khảo sát Quiz2_1 */ }
            <Route path="/quiz2_1" element={<Quiz2_1Page />}> </Route>
            {/* Trang của khảo sát Quiz2_2 */}
            <Route path="/quiz2_2" element={<Quiz2_2Page />}> </Route>
            {/* Trang của khảo sát Quiz2_3 */}
            <Route path="/quiz2_3" element={<Quiz2_3Page />}> </Route>
            {/* Trang cảm ơn */}
            <Route path="/thanks" element={<ThanksPage />}> </Route>
            {/* Trang Khám phá thêm */}
            <Route path="/more" element={<MorePage />}> </Route>

            {/*  hitoadventuregame */}
            {/* Trang chủ hitoadventure */}
            <Route path="/home-adventure" element={<HomePageAdventure />} />
            {/* 2. Thêm Route cho trang User Info */}
            <Route path="/user-info" element={<UserInfoPage />} />
            {/* 3. Thêm Route cho trang Game */}
            <Route path="/game" element={<GamePage />} />
            {/* 4. Thêm Route cho trang Result */}
            <Route path="/result" element={<ResultPage />} />
            {/* 5. Thêm Route cho trang Lucky Spin */}
            <Route path="/lucky-spin" element={<LuckySpinPage />} />


            {/* hitocareer */}
            <Route path="/career" element={<HomePagecareer />}></Route>

            {/* English */}
            <Route path="/english" element={<HomePageEnglish />}></Route>

            {/* Visa Test */}
            <Route
              path="/visa-test"
              element={
                <VisaTestProvider>
                  <VisaTestPage />
                </VisaTestProvider>
              }
            ></Route>

          </AnimationRoutes>
        </ZMPRouter>
      </SnackbarProvider>
    </App>
  );
};
export default Layout;
