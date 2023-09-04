
import Admin from './Pages/AdminPage';

import StudentState from './context/StudentState';
import CourseState from './context/CourseState';
import DepartmentState from './context/DepartmentState';

function App() {
 
  return (
    <>
    <DepartmentState>
      <CourseState>
        <StudentState>

          <Admin />
        </StudentState>
      </CourseState>
      </DepartmentState>
    </>
  );
}

export default App;
