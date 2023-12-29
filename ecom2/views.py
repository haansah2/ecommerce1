from django.shortcuts import render, redirect
from django.urls import path
from .models import *
from django.contrib.auth.models import User, auth
from django.contrib import messages
from django.http import JsonResponse
from .utils import cookieCart, cartData, guestOrder
import json
import datetime


# def post(request, pk):
#     return render(request, "post.html", {'posts': pk})


def index(request):
    data = cartData(request)
    cartItems = data['cartItems']
    products = Product.objects.all()
    post = [1,2]
    context = {"products": products, 'cartItems': cartItems, "posts": post}
    return render(request, "index.html", context)


def post(request, pk):
    data = cartData(request)
    cartItems = data['cartItems']
    products = Product.objects.all()

    context = {"products": products, 'cartItems': cartItems, "pk": pk}
    return render(request, "post.html", context)

def cart(request):
    data = cartData(request)
    cartItems = data['cartItems']
    order = data['order']
    items = data['items']
    

    context = {'items':items, 'order': order, 'cartItems': cartItems}
    return render(request, "cart.html", context)

def checkout(request):
    data = cartData(request)
    cartItems = data['cartItems']
    order = data['order']
    items = data['items']

    context = {'items':items, 'order': order, 'cartItems' : cartItems}
    return render(request, "checkout.html", context)


def login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        user = auth.authenticate(username=username, password=password)


        if user is not None:
            auth.login(request, user)
            return redirect('/')
        
        else:
            messages.info(request, 'credentials invalid')
            return redirect('login')
        
    else:
        return render(request, 'login.html')


def logout(request):
    auth.logout(request)
    return redirect("/")


def register(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        password2 = request.POST['password2']

        if password == password2:
            if User.objects.filter(username = username).exists():
                messages.info(request, 'username already taken')
                return redirect('register')
            elif User.objects.filter(email = email).exists():
                messages.info(request, 'email already taken')
                return redirect('register')
            else:
                user = User.objects.create_user(email=email, username=username, password=password)
                user.save();
                return redirect('login')

        else: 
            messages.info(request, 'passwords are not the same')
            return redirect('register')

    else:
        return render(request, 'register.html',)


def update_item(request):
    data = json.loads(request.body)
    productId = data['productId']
    action = data['action']

    print('Action:', action)
    print('productId:', productId)

    customer = request.user.customer
    product = Product.objects.get(id=productId)
    order, created = Order.objects.get_or_create(customer = customer, complete = False)

    orderItem, created = OrderItem.objects.get_or_create(order=order, product=product)

    if action == 'add':
        orderItem.quantity = orderItem.quantity + 1
    elif action == 'remove':
        orderItem.quantity = orderItem.quantity - 1

    orderItem.save()

    if orderItem.quantity <= 0:
        orderItem.delete()
    return JsonResponse('Item was added', safe=False)


def processOrder(request):
    data = json.loads(request.body)
    transaction_id = datetime.datetime.now().timestamp()
    print(transaction_id)
    user = request.user
    if request.user.is_authenticated:
        customer = request.user.customer
        order, created = Order.objects.get_or_create(customer=customer, complete = False)

    else:
        user.email = data['form']['email']
        customer, order = guestOrder(request, data)
    print(user.email)
    total = float(data['form']['total'])
    order.transaction_id = transaction_id

    if total == float(order.get_cart_total):
        order.complete = True
        print('really')
        print(order.get_cart_total)
    else: 
        print('seriously')
        print(order.get_cart_total)
    order.save()

    if order.shipping == True:
        ShippingAddress.objects.create(
            customer = customer,
            order = order,
            address = data['shipping']['address'],
            city = data['shipping']['city'],
            state = data['shipping']['state'],
            zipcode = data['shipping']['zipcode'],
        )

    return JsonResponse("Payment complete", safe=False)

def search(request):
    if request.method == "POST":
        searched = request.POST['searched']
        content = Product.objects.filter(name__contains=searched)
        return render(request, 'search.html', {'searched': searched, 'contents': content})
    else:
        return JsonResponse('hey there', safe=False)
    return ''