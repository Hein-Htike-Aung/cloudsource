const successResponse = (data: any, message = 'Retrieved') => ({
  statusCode: 200,
  message,
  data,
});

export default successResponse;
