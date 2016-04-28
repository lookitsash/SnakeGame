<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="SnakeGame.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <style>
        html, body {
			width: 100%;
			height: 100%;
			margin: 0px;
			border: 0;
			overflow: hidden; /*  Disable scrollbars */
			display: block;  /* No floating content on sides */
		}
        canvas {
            position:absolute;
            left: 0px;
            top: 0px;
        }
    </style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min.js"></script>
    <script src="Resources/Scripts/Resources.js"></script>
    <script src="Resources/Scripts/Snake.js"></script>
</head>
<body>
    <div>
        <canvas id="mainCanvas"></canvas>
    </div>
</body>
</html>
