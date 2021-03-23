import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { productDetail } from "../../../../_actions/product_actions";
import { Formik } from "formik";
import * as Yup from "yup";
import { Typography, Button, Form, Input } from "antd";
import { editProduct } from "../../../../_actions/product_actions";

const { Title } = Typography;

function UpdateProduct(props) {
  const dispatch = useDispatch(); //dispatch for redux
  let productId = props.match.params.productId;
  const [productDe, setProductDe] = useState();
  let dataToSubmit = {
    productId,
  };
  if (!productDe) {
    dispatch(productDetail(dataToSubmit))
      .then((response) => {
        if (response.payload.success) {
          setProductDe(response.payload.product);
        } else {
          console.log(response.payload);
        }
      })
      .catch((err) => {
        alert(err);
      });
  }
  const [formErrorMessage, setFormErrorMessage] = useState("");

  return (
    <>
      {productDe && (
        <div>
          <Formik
            initialValues={{
              mainImg: productDe.mainImg,
              name: productDe.productName,
              price: productDe.price,
              rate: productDe.rate,
            }}
            validationSchema={Yup.object().shape({
              rate: Yup.number("할인율을 숫자로 입력해 주세요")
                .integer("할인율을 정확히 입력해 주세요"),
              price: Yup.number("가격을 숫자로 입력해 주세요")
                .positive("가격을 양수로 입력해 주세요")
                .integer("가격을 정확히 입력해 주세요"),
            })}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                let dataToSubmit = {
                  id: productId,
                  rate: values.rate,
                  price: values.price,
                };
                dispatch(editProduct(dataToSubmit))
                  .then((response) => {
                    if (response.payload.success) {
                      props.history.push(`/product/${productId}`);
                    } else {
                      setFormErrorMessage("Error occurred"); //에러 메세지 세팅
                    }
                  })
                  .catch((err) => {
                    setFormErrorMessage("Error occurred");
                    setTimeout(() => {
                      //일정 시간이 지난 후 함수 실행 setTimeout(실행시킬 함수, 시간)
                      setFormErrorMessage("");
                    }, 3000);
                  });
                setSubmitting(false);
              }, 500);
            }}
          >
            {(props) => {
              const {
                values,
                touched,
                errors,
                isSubmitting,
                handleChange,
                handleBlur,
                handleSubmit,
              } = props;
              return (
                <div style={{ maxWidth: "500px", margin: "3rem auto" }}>
                  <div style={{ marginBottom: "2rem" }}>
                    <Title level={3}>상품 수정</Title>
                  </div>
                  <form
                    onSubmit={handleSubmit}
                    style={{ width: "500px" }}
                    encType="multipart/form-data"
                  >
                    {/* 기등록된 이미지 */}
                    <img
                      src={values.mainImg}
                      alt="mainImg"
                      style={{ width: "400px", marginTop: "20px" }}
                    />
                    <Form.Item label={"상품명"} required>
                      <Input
                        id="name"
                        disabled={true}
                        placeholder="Product name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          errors.name && touched.name
                            ? "text-input error"
                            : "text-input"
                        }
                      />
                      {errors.name && touched.name && (
                        <div className="input-feedback">{errors.name}</div>
                      )}
                    </Form.Item>
                    <Form.Item label={"판매금액(원)"} required>
                      <Input
                        id="price"
                        value={values.price}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          errors.price && touched.price
                            ? "text-input error"
                            : "text-input"
                        }
                      />
                      {errors.price && touched.price && (
                        <div className="input-feedback">{errors.price}</div>
                      )}
                    </Form.Item>
                    <Form.Item label={"할인율(%)"}>
                      <Input
                        id="rate"
                        value={values.rate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          errors.rate && touched.rate
                            ? "text-input error"
                            : "text-input"
                        }
                      />
                      {errors.rate && touched.rate && (
                        <div className="input-feedback">{errors.rate}</div>
                      )}
                    </Form.Item>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "30px",
                      }}
                    >
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{ margin: "0 2px" }}
                        disabled={isSubmitting}
                        onSubmit={handleSubmit}
                      >
                        수정
                      </Button>
                      <Button style={{ margin: "0 2px" }}>
                        <Link to="/admin">취소</Link>
                      </Button>
                    </div>
                  </form>
                </div>
              );
            }}
          </Formik>
        </div>
      )}
    </>
  );
}

export default UpdateProduct;
