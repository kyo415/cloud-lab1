const API =
  window.location.hostname.includes("app.github.dev")
    ? `https://${window.location.hostname.replace("-5173.", "-5000.")}/api/students`
    : "http://localhost:5000/api/students";import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [students, setStudents] = useState([]);

    const [studentId, setStudentId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [editingId, setEditingId] = useState(null);

    const API = "http://localhost:5000/api/students";

    // Lấy danh sách sinh viên
    const loadStudents = () => {
        fetch(API)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Không thể lấy danh sách sinh viên");
                }
                return response.json();
            })
            .then((data) => {
                setStudents(data);
            })
            .catch((error) => {
                console.error("Lỗi GET:", error);
            });
    };

    useEffect(() => {
        loadStudents();
    }, []);

    // Thêm / Cập nhật
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!studentId || !name || !email) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const studentData = {
            studentId,
            name,
            email
        };

        try {
            let response;

            if (editingId) {
                // Câu 77 - PUT
                response = await fetch(`${API}/${editingId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(studentData)
                });
            } else {
                // Câu 75 - POST
                response = await fetch(API, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(studentData)
                });
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    (editingId
                        ? "Không thể cập nhật sinh viên"
                        : "Không thể thêm sinh viên")
                );
            }

            if (editingId) {
                setStudents((prevStudents) =>
                    prevStudents.map((student) =>
                        student._id === editingId ? data : student
                    )
                );

                alert("Cập nhật sinh viên thành công!");
            } else {
                setStudents((prevStudents) => [
                    ...prevStudents,
                    data
                ]);

                alert("Thêm sinh viên thành công!");
            }

            cancelEdit();

        } catch (error) {
            console.error("Lỗi:", error);
            alert(error.message);
        }
    };

    // Bấm nút Sửa
    const editStudent = (student) => {
        setEditingId(student._id);
        setStudentId(student.studentId);
        setName(student.name);
        setEmail(student.email);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // Hủy sửa
    const cancelEdit = () => {
        setEditingId(null);
        setStudentId("");
        setName("");
        setEmail("");
    };

    // Câu 78 - Xóa
    const deleteStudent = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa sinh viên này?")) {
            return;
        }

        try {
            const response = await fetch(`${API}/${id}`, {
                method: "DELETE"
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Không thể xóa sinh viên"
                );
            }

            setStudents((prevStudents) =>
                prevStudents.filter((student) => student._id !== id)
            );

            alert("Xóa sinh viên thành công!");

        } catch (error) {
            console.error("Lỗi DELETE:", error);
            alert(error.message);
        }
    };

    return (
        <div className="app">

            <header className="header">
                <div>
                    <p className="subtitle">
                        STUDENT MANAGEMENT SYSTEM
                    </p>

                    <h1>Version 2.0 - Quản lý sinh viên</h1>

                    <p className="description">
                        Quản lý thông tin sinh viên nhanh chóng và đơn giản
                    </p>
                </div>

                <div className="student-count">
                    <span>{students.length}</span>
                    <small>Sinh viên</small>
                </div>
            </header>

            <main className="container">

                {/* FORM */}
                <section className="card form-card">

                    <div className="card-title">

                        <div className="icon">
                            {editingId ? "✎" : "+"}
                        </div>

                        <div>
                            <h2 style={{color: "#1F2937"}}>
                                {editingId
                                    ? "Cập nhật sinh viên"
                                    : "Thêm sinh viên"}
                            </h2>

                            <p>
                                {editingId
                                    ? "Chỉnh sửa thông tin sinh viên"
                                    : "Nhập thông tin sinh viên mới"}
                            </p>
                        </div>

                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="form-group">
                            <label>Mã sinh viên</label>

                            <input
                                type="text"
                                placeholder="VD: SV003"
                                value={studentId}
                                onChange={(e) =>
                                    setStudentId(e.target.value)
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Họ và tên</label>

                            <input
                                type="text"
                                placeholder="Nguyen Van C"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>

                            <input
                                type="email"
                                placeholder="example@gmail.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                            />
                        </div>

                        <button type="submit">
                            <span>{editingId ? "✓" : "+"}</span>
                            {editingId
                                ? "Cập nhật sinh viên"
                                : "Thêm sinh viên"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={cancelEdit}
                                style={{
                                    marginTop: "10px",
                                    background: "#6b7280"
                                }}
                            >
                                Hủy sửa
                            </button>
                        )}

                    </form>
                </section>

                {/* LIST */}
                <section className="card list-card">

                    <div className="card-title">

                        <div className="icon list-icon">
                            ☰
                        </div>

                        <div>
                            <h2 style={{color: "#1F2937"}}>Danh sách sinh viên</h2>

                            <p>
                                Quản lý sinh viên
                            </p>
                        </div>

                    </div>

                    {students.length === 0 ? (

                        <div className="empty">
                            <div className="empty-icon">○</div>

                            <h3>Chưa có sinh viên</h3>

                            <p>
                                Hãy thêm sinh viên đầu tiên
                            </p>
                        </div>

                    ) : (

                        <div className="table-wrapper">

                            <table>

                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>MSSV</th>
                                        <th>Họ và tên</th>
                                        <th>Email</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {students.map(
                                        (student, index) => (

                                            <tr key={student._id}>

                                                <td>
                                                    {index + 1}
                                                </td>

                                                <td>
                                                    <span className="student-id">
                                                        {student.studentId}
                                                    </span>
                                                </td>

                                                <td>
                                                    <strong>
                                                        {student.name}
                                                    </strong>
                                                </td>

                                                <td className="email">
                                                    {student.email}
                                                </td>

                                                <td>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            editStudent(student)
                                                        }
                                                        style={{
                                                            background: "#2563eb",
                                                            color: "white",
                                                            border: "none",
                                                            padding: "7px 12px",
                                                            borderRadius: "6px",
                                                            marginRight: "6px",
                                                            cursor: "pointer"
                                                        }}
                                                    >
                                                        Sửa
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            deleteStudent(
                                                                student._id
                                                            )
                                                        }
                                                        style={{
                                                            background: "#dc2626",
                                                            color: "white",
                                                            border: "none",
                                                            padding: "7px 12px",
                                                            borderRadius: "6px",
                                                            cursor: "pointer"
                                                        }}
                                                    >
                                                        Xóa
                                                    </button>
                                                </td>

                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>
                    )}

                </section>

            </main>

            <footer>
                Student Management System • React + Express + MongoDB
            </footer>

        </div>
    );
}

export default App;
