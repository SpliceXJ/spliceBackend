-- CreateEnum
CREATE TYPE "DaysOfTheWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "brandname" TEXT NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Menu" (
    "id" TEXT NOT NULL,
    "menuName" TEXT NOT NULL,
    "menuDescription" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "vendorId" TEXT NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodItem" (
    "id" TEXT NOT NULL,
    "menuID" TEXT NOT NULL,
    "foodName" TEXT NOT NULL,
    "foodPrice" TEXT NOT NULL,
    "foodDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FoodItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodImages" (
    "id" TEXT NOT NULL,
    "foodItemId" TEXT NOT NULL,

    CONSTRAINT "FoodImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuImages" (
    "id" TEXT NOT NULL,
    "menuID" TEXT NOT NULL,

    CONSTRAINT "MenuImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consumer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Consumer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "roleName" TEXT NOT NULL,
    "roleDescription" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "vendorId" TEXT NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleAccess" (
    "employeeId" TEXT NOT NULL,
    "payment" BOOLEAN NOT NULL,
    "operation" BOOLEAN NOT NULL,
    "Inventory" BOOLEAN NOT NULL,
    "general" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "BusinessHours" (
    "id" TEXT NOT NULL,
    "days" "DaysOfTheWeek" NOT NULL,
    "openingTime" TIMESTAMP(3) NOT NULL,
    "closedTime" TIMESTAMP(3) NOT NULL,
    "isOpen" BOOLEAN NOT NULL,
    "isClosed" BOOLEAN NOT NULL,
    "vendorId" TEXT NOT NULL,

    CONSTRAINT "BusinessHours_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_userId_key" ON "Vendor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Menu_vendorId_key" ON "Menu"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "FoodItem_menuID_key" ON "FoodItem"("menuID");

-- CreateIndex
CREATE UNIQUE INDEX "FoodItem_foodName_key" ON "FoodItem"("foodName");

-- CreateIndex
CREATE UNIQUE INDEX "FoodItem_foodPrice_key" ON "FoodItem"("foodPrice");

-- CreateIndex
CREATE UNIQUE INDEX "FoodImages_foodItemId_key" ON "FoodImages"("foodItemId");

-- CreateIndex
CREATE UNIQUE INDEX "MenuImages_menuID_key" ON "MenuImages"("menuID");

-- CreateIndex
CREATE UNIQUE INDEX "Consumer_userId_key" ON "Consumer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_vendorId_key" ON "Employee"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "RoleAccess_employeeId_key" ON "RoleAccess"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessHours_vendorId_key" ON "BusinessHours"("vendorId");

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodItem" ADD CONSTRAINT "FoodItem_menuID_fkey" FOREIGN KEY ("menuID") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodImages" ADD CONSTRAINT "FoodImages_foodItemId_fkey" FOREIGN KEY ("foodItemId") REFERENCES "FoodItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuImages" ADD CONSTRAINT "MenuImages_menuID_fkey" FOREIGN KEY ("menuID") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consumer" ADD CONSTRAINT "Consumer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleAccess" ADD CONSTRAINT "RoleAccess_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessHours" ADD CONSTRAINT "BusinessHours_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
